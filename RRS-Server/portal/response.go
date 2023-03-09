package main

// Response represents the payload sent back to the client after a request.
type Response struct {
	Success   bool    `json:"success"`
	RequestID *string `json:"requestId"`
	Error     *string `json:"error"`
}
