try {
    $body = @{email='doctor@mediqueue.com';password='doctor123'} | ConvertTo-Json
    $response = Invoke-WebRequest -Uri 'http://localhost/hospital-backend/api/auth/login.php' -Method Post -Body $body -ContentType 'application/json' -UseBasicParsing
    $response.Content | Out-File -FilePath d:\hospital\login_error_v3.html
} catch {
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $content = $reader.ReadToEnd()
        $content | Out-File -FilePath d:\hospital\login_error_v3.html
    } else {
        $_.Exception.Message | Out-File -FilePath d:\hospital\login_error_v3.html
    }
}
