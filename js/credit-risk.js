document.getElementById("riskForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = {};
  formData.forEach((value, key) => data[key] = Number(value));

  // Add all missing one-hot values with defaults
  data["home_ownership_MORTGAGE"] = 1;  // or derive from dropdown
  data["home_ownership_RENT"] = 0;
  // ... fill in the rest appropriately

  try {
    const response = await fetch("https://credit-risk-api-t8hy.onrender.com/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    document.getElementById("result").innerText = `Default Probability: ${result.default_probability.toFixed(2)}, Class: ${result.predicted_class}`;
  } catch (error) {
    document.getElementById("result").innerText = "Error calling the API.";
  }
});