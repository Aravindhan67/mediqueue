try {
    $body = @{email='doctor@mediqueue.com';password='doctor123'} | ConvertTo-Json
    $response = Invoke-WebRequest -Uri 'http://localhost/hospital-backend/api/auth/login.php' -Method Post -Body $body -ContentType 'application/json' -UseBasicParsing
    $response.Content | Out-File d:\hospital\login_success.html
} catch {
    $e = $_.Exception
    if ($e.Response) {
       $s = $e.Response.GetResponseStream()
       $r = New-Object System.IO.StreamReader($s)
       $t = $r.ReadToEnd()
       $t | Out-File d:\hospital\login_error_full.html
    } else {
       "No response: " + $e.Message | Out-File d:\hospital\login_error_msg.txt
    }
}
