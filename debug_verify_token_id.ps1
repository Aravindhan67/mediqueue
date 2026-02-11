$baseUrl = "http://localhost/hospital-backend/api"
$email = "patient@mediqueue.com"
$password = "patient123"

# Login
Write-Host "Logging in..."
try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login.php" -Method Post -Body (@{email=$email;password=$password}|ConvertTo-Json) -ContentType "application/json"
    $token = $loginResponse.data.token
    Write-Host "Login Success."
    # Decode token to verify payload (simple base64 decode of middle part)
    $payload = $token.Split('.')[1]
    # Add padding if needed
    switch ($payload.Length % 4) {
        2 { $payload += "==" }
        3 { $payload += "=" }
    }
    $decodedBytes = [System.Convert]::FromBase64String($payload)
    $decodedText = [System.Text.Encoding]::UTF8.GetString($decodedBytes)
    Write-Host "Token Payload: $decodedText"
} catch {
    Write-Error "Login Failed: $($_.Exception.Message)"
    exit 1
}

$headers = @{Authorization="Bearer $token"}

# Test doctor.php directly
Write-Host "`nTesting GET appointments/patient.php..."
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/appointments/patient.php" -Method Get -Headers $headers
    Write-Host "Success!"
    Write-Host ($response | ConvertTo-Json -Depth 5)
} catch {
    Write-Error "Failed: $($_.Exception.Message)"
    if ($_.Exception.Response) {
         $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
         Write-Host "Body: $($reader.ReadToEnd())"
    }
}
