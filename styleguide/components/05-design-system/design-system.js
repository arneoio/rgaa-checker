const iconSizeSlider = document.getElementById('styleguide-icon-size-slider');

if (iconSizeSlider) {
  iconSizeSlider.addEventListener('change', function (e) {
    updateIconsize(e.currentTarget.value);
  });
  iconSizeSlider.addEventListener('input', function (e) {
    updateIconsize(e.currentTarget.value);
  });
}
const fontSizeSlider = document.getElementById('styleguide-font-size-slider');
if (fontSizeSlider) {
  fontSizeSlider.addEventListener('change', function (e) {
    updateFontsize(e.currentTarget.value);
  });
  fontSizeSlider.addEventListener('input', function (e) {
    updateFontsize(e.currentTarget.value);
  });
}

function updateIconsize(value) {
  const iconSize = value + 'px';
  document.getElementById('styleguide-icon-size-value').innerText = iconSize;
  [].forEach.call(
    document.querySelectorAll('.icons_image, .icons_image svg'),
    function (el) {
      el.style.height = iconSize;
      el.style.maxWidth = iconSize;
    },
  );
}

function updateFontsize(value) {
  const fontSize = value + 'px';
  document.getElementById('styleguide-font-size-value').innerText = fontSize;
  [].forEach.call(document.querySelectorAll('.fontsListItem'), function (el) {
    el.style.fontSize = fontSize;
  });
}
