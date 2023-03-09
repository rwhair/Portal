package main

import (
	"os"
)

var (
	smtpHost = os.Getenv("SMTP_HOST")
	smtpPort = os.Getenv("SMTP_PORT")
	smtpUser = os.Getenv("SMTP_USER")
	smtpPass = os.Getenv("SMTP_PASS")
)

const (
	emailBccUser = "rhair@rrsmedical.com"
	emailSubject = "Records Request Confirmation"
	emailMessage = `
<p>
Thank you for allowing RRS to fulfill your request for records. Your order %s for %s to be
sent to %s via %s has been received and is being processed by our highly trained team at RRS.
Your records will be available within %s.
</p>
<p>Total Cost: $%0.2f</p>
<p>
Our Customer Service team is available to provide real-time support throughout the entire
process.
</p>
<p>
If you have any questions regarding your order, please contact RRS at status@rrsmedical.com,
or you may call us at 484-468-1299.
</p>
<p>
Thank you,
<br/>
RRS Service Team
</p>
`
)
