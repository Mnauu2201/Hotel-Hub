# Test sync room status API
$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer YOUR_ADMIN_TOKEN"
}

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/rooms/sync-status" -Method POST -Headers $headers
    Write-Host "Sync successful:"
    Write-Host $response | ConvertTo-Json
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    Write-Host "Response: $($_.Exception.Response)"
}
