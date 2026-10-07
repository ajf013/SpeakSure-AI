output "resource_group_name" {
  value       = azurerm_resource_group.rg.name
  description = "Resource Group created"
}

output "web_app_url" {
  value       = "https://${azurerm_linux_web_app.app.default_hostname}"
  description = "SpeakSure AI Web Application URL"
}

output "application_insights_key" {
  value       = azurerm_application_insights.appi.instrumentation_key
  sensitive   = true
  description = "Application Insights Instrumentation Key"
}

output "speech_service_endpoint" {
  value       = azurerm_cognitive_account.speech.endpoint
  description = "Azure Speech Service Endpoint"
}
