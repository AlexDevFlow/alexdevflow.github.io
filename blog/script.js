document.addEventListener('DOMContentLoaded', function() {
    const text = "Nothing to see here yet, the inspiration is still flowing...";
    const typingElement = document.querySelector('.typing-text');
    let i = 0;

    function typeWriter() {
        if (i < text.length) {
            typingElement.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 70);
        }
    }

    typeWriter();
});