---
title: "Building a Telegram Bot That Replaced a Broken News System"
description: "How I built a Python bot that scraped announcements from a website and pushed them to 2000+ students and parents on Telegram, with fuzzy search, inline queries, and an admin dashboard."
publishDate: 2026-04-06
author: "Alessandro Trysh"
tags: ["Python", "Telegram", "Web Scraping", "BeautifulSoup", "Automation"]
draft: false
---

Back when I was in high school, the administration published official announcements on the website. Schedule changes, exam dates, event cancellations, deadlines. The kind of stuff you really don't want to miss. The problem was that the website was not exactly a pleasant experience, and there was no notification system. You had to manually navigate there and scroll through a table hoping to notice something new. So naturally, nobody did.

Students would miss deadlines. Parents would find out about cancelled classes after their kid had already left. Teachers would say "we published the announcement" and technically they were right, but publishing something nobody reads is arguably the same as not publishing it at all.

I decided to fix this by building a Telegram bot that would scrape the website automatically and push new posts directly to subscribers. The idea was simple: meet people where they already are. Every class had a Telegram group, everyone had the app, notifications were already enabled. The barrier to entry was pressing "Start." That's it.

This ended up being my first project that was actually widely used. The place had over 2000 students, and it wasn't just students. Parents started subscribing too. Teachers would mention it in class. It went from a side project to a small piece of infrastructure, which changed how I thought about writing software entirely. Suddenly a crash at 2 AM meant people missed a morning update.

I can't share the full source code right now for bureaucratic reasons (long story), but I want to walk through how everything works, what tripped me up, and what I'd do differently now.

---

## Table of Contents

1. [Architecture: The Whole Picture](#part-1-architecture-the-whole-picture)
2. [Scraping the Website](#part-2-scraping-the-website)
3. [The Database Layer](#part-3-the-database-layer)
4. [Pushing Notifications](#part-4-pushing-notifications)
5. [User-Facing Features](#part-5-user-facing-features)
6. [Fuzzy Search](#part-6-fuzzy-search)
7. [Inline Queries](#part-7-inline-queries)
8. [The Admin Panel](#part-8-the-admin-panel)
9. [What I'd Improve](#part-9-what-id-improve)

---

## Part 1: Architecture: The Whole Picture

The bot is a single Python process doing three jobs at once:

1. **Scraping** the target website every 30 minutes using `requests` and `BeautifulSoup`
2. **Storing** entries in a local SQLite database to track what's new
3. **Handling** user interactions through the Telegram Bot API via `python-telegram-bot`


The `python-telegram-bot` library is async, built on top of `asyncio`. The bot uses long polling to receive updates from Telegram's servers, which means it opens a connection and waits for new messages rather than exposing an HTTP endpoint. This avoids the need for a public-facing server, SSL certificates, or port forwarding. You just run the script and it works.

The scraping job runs on a repeating schedule using the library's built-in `JobQueue`, which hooks into the same async event loop. Every 30 minutes, the job fires, scrapes the website, compares what it found against the database, and if there's anything new, sends notifications to every registered user.

---

## Part 2: Scraping the Website

The announcements page was an HTML table. Each row has a link (the title, pointing to the PDF or detail page) and a date cell. Simple enough.

The scraper fetches the page with a 7-second timeout. The server was not always fast, and I learned early on that hanging indefinitely on a request is a great way to freeze your entire bot. Seven seconds is generous enough for slow responses but short enough that it doesn't block the event loop for too long.

BeautifulSoup parses the HTML and locates the `<tbody>` element. The scraper has fallback selectors too, checking for `div.announcements-list` or `section.announcements`, because these kinds of websites have a habit of getting redesigned without warning. I woke up one morning to a broken bot because the page structure had silently changed. Added the fallbacks that same day.

For each row, the scraper extracts three things: the link text (title), the `href` attribute (URL), and the date from the adjacent cell. The URL gets URL-encoded with `urllib.parse.quote` because some announcement filenames contain spaces and accented characters. The `safe=''` parameter encodes everything, which is more aggressive than necessary but I'd rather over-encode than debug a broken link :)

### The Date Problem

The website displayed dates in Italian: "15 marzo 2026." The database needs them in ISO format ("2026-03-15") for proper chronological sorting, because `ORDER BY date DESC` on strings only works correctly with ISO dates. So every date goes through a conversion function that maps Italian month names to their numeric equivalents.

This sounds straightforward, and it was, until I changed the format. Early versions of the bot stored dates differently: I translated the Italian month name to English but didn't convert to ISO. Later I realized that was useless for sorting, so I switched to ISO. But now the database had a mix of old-format and new-format dates, and the scraper kept inserting duplicates because "15 March 2026" didn't match "2026-03-15." So the comparison step has to check both formats:

```
SELECT * FROM announcements WHERE title = ? AND url = ? AND (date = ? OR date = ?)
```

If the entry exists with the old format, it updates the date to the new format rather than inserting a duplicate. Backward compatibility in a notification bot. Not something I expected to need.

### Detecting Removals

The scraper doesn't just add new entries. It also removes entries that are no longer on the website. The administration occasionally took down posts (retractions, corrections, superseded documents). After processing all rows from the page, the scraper compares the full set of `(title, url)` pairs found on the website against everything in the database. Anything in the database but not on the website gets deleted.

This means the bot mirrors the website's current state rather than accumulating entries forever. If something gets retracted, the database reflects that. It doesn't notify users about removals though, which in hindsight might have been useful.

---

## Part 3: The Database Layer

Not much to say here. SQLite. Zero configuration, no server process, single file :D

---

## Part 4: Pushing Notifications

When the scraper finds new entries, it queries every user ID from the database and sends each one a notification. The message is formatted in Markdown with the title as a clickable link, the date below it, and two inline buttons: one linking to the homepage, one to the announcements page.

The critical detail here is rate limiting. Telegram enforces limits on how fast a bot can send messages, so yeah keep that in mind and prevent the not so convenient experience of finding Durov and his team at your doorstep :)

Error handling is per-user. If someone has blocked the bot or deleted their Telegram account, the send fails for that specific user, but the loop continues for everyone else.

Now, here's something stupid I did. I used `time.sleep()` inside an async function. This blocks the entire event loop, which means the bot can't process any user commands while notifications are being sent. For five minutes. Nobody can search, nobody can browse, nothing works until every single notification has been sent. The correct approach is `await asyncio.sleep(0.5)`, which yields control back to the event loop between messages. I didn't realize this until someone complained that the bot "freezes every morning." More on this in Part 9.

---

## Part 5: User-Facing Features

The bot's interface is entirely driven by Telegram's inline keyboard system. No typed commands beyond `/start`. Every interaction happens through buttons, which was a deliberate choice: many users (especially parents) aren't comfortable with command-based interfaces. Buttons are self-documenting.

### The Main Menu

When a user sends `/start`, two things happen. First, their chat ID gets registered in the database for notifications. Second, they see a menu with four buttons:

- **Latest Announcements**: shows the 5 most recent posts, sorted by date descending
- **Search**: enters search mode, prompting the user to type a keyword
- **Informazioni**: explains how to use the bot
- **Disattiva Notifiche**: unsubscribes the user (deletes their ID from the database)

If the user's Telegram username matches one of the hardcoded admin usernames, a fifth button appears: "Menu Admin." This is a simple check, no authentication system, no password. Just a list of trusted usernames. Not exactly production-grade security, but for a bot managed by two students, it worked fine.

The unsubscribe button deletes the user's chat ID from the database. Simple as that. If they send `/start` again, they get re-registered. No confirmation dialog, no "are you sure?" prompt. I considered adding one, but decided it was unnecessary friction. If someone wants to unsubscribe, let them. They can always come back.

---

## Part 6: Fuzzy Search

OK so this is where it gets fun. The basic search was straightforward: user types a keyword, bot runs `SELECT * FROM announcements WHERE title LIKE '%keyword%'`, returns paginated results. Done. Except people can't spell.

The titles are formal Italian bureaucratic language. "Comunicazione variazione orario" or "Convocazione consiglio di classe straordinario." Try typing that on a phone. Students would search "orientamento" and get results, then search "orinetamento" (swapped two letters) and get nothing. "No results found." Meanwhile the thing they want is sitting right there in the database.

This annoyed me enough that I built a fallback. When the exact substring match returns zero results, the bot tries a longest-common-substring approach. For every entry in the database, it finds the longest substring that appears in both the query and the title. If that substring is at least 3 characters long, it's considered a match. Results get ranked by match length, longest first.

The algorithm is simple: slide a window over the query string, starting at the full length and shrinking by one character each iteration. For each window position, check if that substring exists in the title. First match you find is the longest common substring for this pair.

### Pagination

Results are displayed 5 per page with "Previous" and "Next" inline buttons. The page number and keyword are encoded in the callback data: `page_2_orientamento` means "show page 2 of results for 'orientamento'." When the user taps a navigation button, the bot reconstructs the search and jumps to the right page.

One edge case I didn't handle well: if new entries are added between page views, the pagination can shift. A user on page 2 might tap "Next" and see a result they already saw, or miss one entirely. In practice this almost never happened because the website updates MAYBE once or twice a day, but it's technically a bug(or a feature just to get that news better in your head)

---

## Part 7: Inline Queries

This ended up being the best feature in the entire bot, and I almost didn't build it.

Telegram supports inline bots: in any chat, you type `@botname query` and results appear in a dropdown without you ever leaving the conversation. I added it mostly because the API made it easy and I thought it was cool. I didn't expect anyone to actually use it.

Then I started seeing it in the wild. Someone in a class group chat asks "did anyone see the post about the trip?" and instead of opening a separate chat, finding it, copying the link, and pasting it back, someone just types `@ITISCastelli_bot gita` right there. A dropdown appears with matching results. Tap one and it gets posted as a formatted message with a clickable link. The whole thing takes maybe three seconds.

Telegram allows up to 50 results per inline query response, each one an `InlineQueryResultArticle` with a title, description, and the message content that gets posted when selected.

What surprised me was that students used this *way* more than the direct bot interaction. People would share news in their class groups constantly. It went from being a notification tool to a sharing tool. Instead of "go check the bot," you just drop the link right into the conversation where the discussion is already happening. I didn't design it to work that way. It just did.

---

## Part 8: The Admin Panel

The bot has a simple admin panel accessible through a "Menu Admin" button that only appears for authorized usernames. Authorization is a hardcoded list of Telegram usernames, checked with a basic string comparison. No roles, no permissions hierarchy. Two admins, both students.

### Broadcasting

The broadcast feature lets admins send a message to every subscriber. The admin taps "Send Broadcast," gets prompted to type a message, and whatever they send next (text, photo, video, or document) gets forwarded to every user in the database.

This uses `python-telegram-bot`'s `ConversationHandler`, which manages multi-step interactions through a state machine. The conversation has one state (`WAITING_FOR_BROADCAST`) and two transitions: receiving a message (which triggers the broadcast and ends the conversation) or tapping "Cancel" (which ends the conversation without sending anything).

The broadcast loop is similar to the notification loop: iterate through all users, send the message, catch errors per-user. The broadcast supports all message types, not just text, because `python-telegram-bot` exposes different methods for each (`send_message`, `send_photo`, `send_video`, `send_document`). The handler checks which media type the admin's message contains and calls the appropriate method.

After broadcasting, the bot reports how many users received the message successfully. This count was useful for monitoring: if it starts dropping over time, it means users are blocking the bot.

### System Dashboard

The admin overview pulls stats from both the database and the system:

```
👥 Total users: 347
📄 Total announcements: 128

💻 System Performance:
  CPU: 12.3%
  CPU Temperature: 54.2°C
  Memory: 34.7% (2 GB / 8 GB)
  Disk: 61.2% (15 GB / 25 GB)
  Active processes: 142
  Network: sent 1024 MB, received 3072 MB
  Uptime: 14 days, 3:22:15
```

The system metrics come from `psutil`, which wraps OS-level APIs for CPU, memory, disk, network, and temperature readings. Was this strictly necessary for a notification bot? No. Was it fun to build? Absolutely. I spent way more time on this dashboard than it deserved, but being able to check server health from a Telegram button without SSH-ing in felt genuinely useful. The "Refresh" button re-fetches everything on tap, so you can watch CPU usage in near real-time.

The temperature reading has a fallback chain: it tries `psutil.sensors_temperatures()`, then tries to extract the `coretemp` sensor, and if anything fails it returns "N/A." Different Linux systems expose temperature sensors differently (or not at all), so the fallback is necessary to avoid crashing on systems without `coretemp` or without any temperature sensors.

---

## Part 9: What I'd Improve

Looking back at this code with more experience, there are things I'd change. Some are architectural, some are just cleaner ways to do what I already did. Most of them I only understand now because I ran into the consequences of not doing them.

### Async All the Way Down

The `python-telegram-bot` library is async, but the scraper uses synchronous `requests` for HTTP calls. This means the scraper blocks the event loop while waiting for the website to respond. During those 7 seconds (worst case), the bot can't process any user commands. Same problem with `time.sleep(0.5)` in the notification loop: it blocks the entire event loop for half a second per user.

I didn't notice this for a while because the bot still felt responsive most of the time. The scrape only runs every 30 minutes, so the 7-second window where things freeze is easy to miss. But when something new drops and the notification loop starts churning through hundreds of users, suddenly search stops responding for several minutes. A student types a query and nothing happens until every notification has been sent. That's when I realized I was mixing sync and async code in a way that defeated the whole point of having an event loop.

### Separate Concerns

Everything runs in one process. If the scraper hangs, everything hangs. If the notification loop is churning through n users, the whole thing is sluggish. I once had the website go down for maintenance while the scraper was trying to connect. The 7-second timeout saved me from a full hang, but during those 7 seconds the bot was unresponsive to everyone.

A cleaner architecture would separate the scraper and the bot into two processes, communicating through the database. The scraper writes new entries, the bot polls for changes and sends notifications. If one crashes, the other keeps running. I didn't think about this when I started because "one script that does everything" was the simplest thing to build, and it was. But simple to build and simple to operate are different things.

### Clean Up Dead Users

When a user blocks the bot, their chat ID stays in the database forever. Every notification cycle, the send fails silently for that user, wasting time and API calls. Over months, these ghost users accumulate. I never actually measured how many dead IDs were in the database, but the success count from broadcasts started slowly drifting below what the total user count suggested.

A better approach: track consecutive failures per user. After N failures (say, 5), automatically remove them. Or at least flag them so the notification loop skips them.

### Now What?

The bot was eventually taken down at the administration's request, so it's no longer active. The full source code can't be published yet either, though we're working on that. A friend of mine built the web interface side of things, but that's his story to tell.

Even so, knowing that something I built was actually used by people, that it solved a real problem they had every day, that still makes me proud. And to my surprise, it's still a conversation starter. People remember the bot, and i am for it :D