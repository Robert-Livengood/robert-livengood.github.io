document.getElementById('credit-risk-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);
  const data = {
    loan_amnt: parseFloat(formData.get('loan_amnt')),
    term: parseInt(formData.get('term')),
    int_rate: parseFloat(formData.get('int_rate')),
    installment: parseFloat(formData.get('installment')),
    annual_inc: parseFloat(formData.get('annual_inc')),
    dti: parseFloat(formData.get('dti')),
    delinq_2yrs: parseInt(formData.get('delinq_2yrs')),
    fico_range_low: parseInt(formData.get('fico_range_low')),
    fico_range_high: parseInt(formData.get('fico_range_high')),
    inq_last_6mths: parseInt(formData.get('inq_last_6mths')),
    open_acc: parseInt(formData.get('open_acc')),
    pub_rec: parseInt(formData.get('pub_rec')),
    revol_util: parseFloat(formData.get('revol_util')),
    total_acc: parseInt(formData.get('total_acc')),

    // One-hot encoding for home_ownership
    home_ownership_MORTGAGE: 0,
    home_ownership_NONE: 0,
    home_ownership_OTHER: 0,
    home_ownership_OWN: 0,
    home_ownership_RENT: 0,

    // One-hot encoding for verification_status
    verification_status_Source_Verified: 0,
    verification_status_Verified: 0,

    // One-hot encoding for purpose
    purpose_credit_card: 0,
    purpose_debt_consolidation: 0,
    purpose_educational: 0,
    purpose_home_improvement: 0,
    purpose_house: 0,
    purpose_major_purchase: 0,
    purpose_medical: 0,
    purpose_moving: 0,
    purpose_other: 0,
    purpose_renewable_energy: 0,
    purpose_small_business: 0,
    purpose_vacation: 0,
    purpose_wedding: 0
  };

  // Set selected values
  data[`home_ownership_${formData.get('home_ownership')}`] = 1;
  data[`verification_status_${formData.get('verification_status')}`] = 1;
  data[`purpose_${formData.get('purpose')}`] = 1;

  // Call the FastAPI endpoint
  const resultDiv = document.getElementById('result');
  resultDiv.textContent = 'Processing...';

  try {
    const res = await fetch('https://credit-risk-api-t8hy.onrender.com/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    resultDiv.innerHTML = `
      <p><strong>Default Probability:</strong> ${(result.default_probability * 100).toFixed(2)}%</p>
      <p><strong>Predicted Class:</strong> ${result.predicted_class === 1 ? 'High Risk' : 'Low Risk'}</p>
    `;
  } catch (error) {
    resultDiv.textContent = 'Error retrieving prediction.';
    console.error(error);
  }
});
