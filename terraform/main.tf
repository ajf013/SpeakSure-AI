terraform {
  required_version = ">= 1.5.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.90.0"
    }
  }
}

provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
}

# Dedicated Resource Group
resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location
}

# Log Analytics Workspace for Application Insights
resource "azurerm_log_analytics_workspace" "law" {
  name                = "law-${var.app_name}-${var.environment}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
}

# Application Insights for Observability
resource "azurerm_application_insights" "appi" {
  name                = "appi-${var.app_name}-${var.environment}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  workspace_id        = azurerm_log_analytics_workspace.law.id
  application_type    = "web"
}

# Azure Key Vault for Credentials and Secrets
resource "azurerm_key_vault" "kv" {
  name                        = "kv-${var.app_name}-${var.environment}"
  location                    = azurerm_resource_group.rg.location
  resource_group_name         = azurerm_resource_group.rg.name
  enabled_for_disk_encryption = true
  tenant_id                   = data.azurerm_client_config.current.tenant_id
  soft_delete_retention_days  = 7
  purge_protection_enabled    = false
  sku_name                    = "standard"
}

data "azurerm_client_config" "current" {}

# Azure Storage Account for Audio/Asset Caching
resource "azurerm_storage_account" "st" {
  name                     = "st${var.app_name}${var.environment}"
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

# Azure Cognitive Services / Azure Speech Resource
resource "azurerm_cognitive_account" "speech" {
  name                = "cog-${var.app_name}-speech-${var.environment}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  kind                = "SpeechServices"
  sku_name            = "S0"
}

# Azure App Service Plan (Cost-Conscious B1 Linux Plan)
resource "azurerm_service_plan" "plan" {
  name                = "asp-${var.app_name}-${var.environment}"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  os_type             = "Linux"
  sku_name            = "B1"
}

# Azure Linux Web App for SpeakSure AI Node.js Backend & PWA
resource "azurerm_linux_web_app" "app" {
  name                = "app-${var.app_name}-${var.environment}"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_service_plan.plan.location
  service_plan_id     = azurerm_service_plan.plan.id

  site_config {
    always_on = true
    application_stack {
      node_version = "20-lts"
    }
  }

  app_settings = {
    "NODE_ENV"                            = "production"
    "APPINSIGHTS_INSTRUMENTATIONKEY"      = azurerm_application_insights.appi.instrumentation_key
    "APPLICATIONINSIGHTS_CONNECTION_STRING" = azurerm_application_insights.appi.connection_string
    "AZURE_SPEECH_KEY"                    = azurerm_cognitive_account.speech.primary_access_key
    "AZURE_SPEECH_REGION"                 = azurerm_cognitive_account.speech.location
  }
}
