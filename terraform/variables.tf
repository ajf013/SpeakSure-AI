variable "subscription_id" {
  type        = string
  description = "Azure Subscription ID"
  default     = "6556862d-2bee-43e2-bd37-4493ea5c1c70"
}

variable "resource_group_name" {
  type        = string
  description = "Resource Group Name"
  default     = "rg-speaksure-ai-prod"
}

variable "location" {
  type        = string
  description = "Azure Region for India college users"
  default     = "southindia"
}

variable "environment" {
  type        = string
  description = "Deployment environment"
  default     = "prod"
}

variable "app_name" {
  type        = string
  description = "Application name prefix"
  default     = "speaksure"
}
