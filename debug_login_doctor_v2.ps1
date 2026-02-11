try {
    $body = @{email='doctor@mediqueue.com';password='doctor123'} | ConvertTo-Json
    $response = Invoke-WebRequest -Uri 'http://localhost/hospital-backend/api/auth/login.php' -Method Post -Body $body -ContentType 'application/json' -UseBasicParsing
    Write-Host "Content: $($response.Content)"
} catch {
    Write-Host "Error Caught!"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Body: $($reader.ReadToEnd())"
    } else {
        Write-Host "Exception: $($_.Exception.Message)"
    }
}
