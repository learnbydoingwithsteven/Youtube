document.addEventListener('DOMContentLoaded', () => {
    const paymentForm = document.getElementById('payment-form');
    const requestSection = document.getElementById('request-section');
    const processingSection = document.getElementById('processing-section');
    const swiftSection = document.getElementById('swift-section');
    const confirmationSection = document.getElementById('confirmation-section');

    const checkFundsLi = document.getElementById('check-funds');
    const checkComplianceLi = document.getElementById('check-compliance');
    const checkBeneficiaryLi = document.getElementById('check-beneficiary');
    const approvalLi = document.getElementById('approval');
    const approvePaymentButton = document.getElementById('approve-payment');

    const swiftMessagePre = document.getElementById('swift-message');
    const sendSwiftButton = document.getElementById('send-swift');

    const confirmationMessageP = document.getElementById('confirmation-message');
    const newPaymentButton = document.getElementById('new-payment');

    let paymentData = {}; // To store form data

    // --- 1. Handle Form Submission ---
    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent actual form submission

        // Collect form data
        paymentData = {
            senderAccount: document.getElementById('sender-account').value,
            receiverName: document.getElementById('receiver-name').value,
            receiverAccount: document.getElementById('receiver-account').value,
            receiverBic: document.getElementById('receiver-bic').value,
            amount: parseFloat(document.getElementById('amount').value).toFixed(2),
            currency: document.getElementById('currency').value,
            paymentReference: document.getElementById('payment-reference').value,
            valueDate: new Date().toISOString().slice(0, 10).replace(/-/g, ''), // YYMMDD format
            transactionRef: `TXN${Date.now()}` // Simple unique ref
        };

        // Hide request form, show processing section
        requestSection.style.display = 'none';
        processingSection.style.display = 'block';
        resetProcessingSteps();
        startProcessingSimulation();
    });

    // --- 2. Simulate Internal Processing ---
    function resetProcessingSteps() {
        [checkFundsLi, checkComplianceLi, checkBeneficiaryLi, approvalLi].forEach(li => {
            li.className = ''; // Remove completed/failed classes
            li.textContent = li.textContent.split('...')[0] + '...'; // Reset text
        });
        approvePaymentButton.disabled = true;
    }

    function simulateStep(element, delay, success = true) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                element.className = success ? 'completed' : 'failed';
                element.textContent = element.textContent.replace('...', success ? ' Completed' : ' Failed');
                if (success) {
                    resolve();
                } else {
                    // In a real app, you'd handle the failure more robustly
                    console.error(`Processing step failed: ${element.id}`);
                    reject(new Error(`Step ${element.id} failed`));
                }
            }, delay);
        });
    }

    async function startProcessingSimulation() {
        try {
            await simulateStep(checkFundsLi, 1500); // Simulate 1.5 sec check
            await simulateStep(checkComplianceLi, 2000); // Simulate 2 sec check
            await simulateStep(checkBeneficiaryLi, 1000); // Simulate 1 sec check

            // If all checks pass, enable approval
            approvalLi.textContent = approvalLi.textContent.replace('...', ' Ready for Approval');
            approvePaymentButton.disabled = false;

        } catch (error) {
            // Handle processing failure (e.g., display error message)
            alert(`Payment processing failed: ${error.message}. Please review the request.`);
            // Optionally reset or go back
            resetToRequest();
        }
    }

    // --- Handle Approval ---
    approvePaymentButton.addEventListener('click', () => {
        approvalLi.className = 'completed';
        approvalLi.textContent = approvalLi.textContent.replace('Ready for Approval', 'Approved');
        approvePaymentButton.disabled = true; // Disable after clicking

        // Move to SWIFT formulation
        processingSection.style.display = 'none';
        swiftSection.style.display = 'block';
        formulateSwiftMessage();
        sendSwiftButton.disabled = false; // Enable sending
    });

    // --- 3. Formulate SWIFT Message ---
    function formulateSwiftMessage() {
        // Basic MT103 Structure Simulation
        const swift = `
{1:F01YOURBANKBICXXX0000000000}{2:I103${paymentData.receiverBic}X}{3:{108:${paymentData.transactionRef}}}
{4:
:20: Sender's Reference
${paymentData.transactionRef}
:23B: Bank Operation Code
CRED
:32A: Value Date, Currency, Amount
${paymentData.valueDate}${paymentData.currency}${paymentData.amount.replace('.', ',')}
:50K: Ordering Customer
//${paymentData.senderAccount}
Sender Name Placeholder
Sender Address Placeholder
:59: Beneficiary Customer
//${paymentData.receiverAccount}
${paymentData.receiverName}
Receiver Address Placeholder
:70: Remittance Information
${paymentData.paymentReference}
:71A: Details of Charges
OUR
-}
        `.trim(); // Trim whitespace

        swiftMessagePre.textContent = swift;
    }

    // --- Handle Send SWIFT ---
    sendSwiftButton.addEventListener('click', () => {
        console.log("Simulating sending SWIFT message...");
        // In a real app, this would trigger an API call
        sendSwiftButton.disabled = true; // Disable after sending

        // Move to confirmation
        swiftSection.style.display = 'none';
        confirmationSection.style.display = 'block';
        confirmationMessageP.textContent = `Payment for ${paymentData.currency} ${paymentData.amount} to ${paymentData.receiverName} processed. SWIFT message sent (Ref: ${paymentData.transactionRef}).`;
    });

    // --- 4. Handle New Payment ---
    newPaymentButton.addEventListener('click', resetToRequest);

    function resetToRequest() {
        paymentForm.reset(); // Clear form fields
        paymentData = {};
        confirmationSection.style.display = 'none';
        processingSection.style.display = 'none';
        swiftSection.style.display = 'none';
        requestSection.style.display = 'block'; // Show form again

        // Reset buttons and steps
        resetProcessingSteps();
        approvePaymentButton.disabled = true;
        sendSwiftButton.disabled = true;
        swiftMessagePre.textContent = '';
    }
});
