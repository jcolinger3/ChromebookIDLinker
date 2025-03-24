// Function to convert device IDs to links
function convertDeviceIdsToLinks() {
  // Find all spans that follow a "Google Id:" label
  const spans = document.evaluate(
    '//label[contains(text(), "Google Id:")]/following-sibling::*//span[@ng-if="!property.Format"][@ng-bind="$ctrl.GetPropertyValue(property)"]',
    document,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null
  );

  // Process each matching span
  for (let i = 0; i < spans.snapshotLength; i++) {
    const span = spans.snapshotItem(i);
    if (!span) continue;

    // Skip if the span is already wrapped in a link
    if (span.parentElement?.closest('a')) {
      continue;
    }

    const text = span.textContent;
    // Verify the content matches the device ID pattern
    const deviceIdPattern = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
    
    if (!text || !deviceIdPattern.test(text)) {
      continue;
    }

    // Create the link
    const link = document.createElement('a');
    link.href = `https://admin.google.com/ac/chrome/devices/${text}`;
    link.textContent = text;
    link.target = '_blank';
    link.style.color = '#1a73e8';
    link.style.textDecoration = 'underline';

    // Replace the span with our link
    span.parentNode.replaceChild(link, span);
  }
}

// Run initially
convertDeviceIdsToLinks();

// Create a MutationObserver to watch for DOM changes
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length > 0) {
      convertDeviceIdsToLinks();
    }
  });
});

// Start observing the document with the configured parameters
observer.observe(document.body, {
  childList: true,
  subtree: true
});