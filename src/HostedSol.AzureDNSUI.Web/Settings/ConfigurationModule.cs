using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Autofac;
using ConfigInjector.Configuration;

namespace HostedSol.AzureDNSUI.Web.Settings
{
    public class ConfigurationModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            ConfigurationConfigurator
                .RegisterConfigurationSettings()
                .FromAssemblies(ThisAssembly)
                .RegisterWithContainer(configSetting => builder.RegisterInstance(configSetting)
                    .AsSelf()
                    .SingleInstance())
                .AllowConfigurationEntriesThatDoNotHaveSettingsClasses(true)
                .DoYourThing();
        }
    }
}