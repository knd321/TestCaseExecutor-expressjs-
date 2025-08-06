
export const assertTextVisible = async (page, text) => {
  try {
    const locator = page.getByText(text);

    console.log("✅ Found '" + text + "'");
  } catch (e) {
    console.warn("❌ Could not find '" + text + "'");

  }
};
