using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Compilation;
using System.Web.Hosting;
using HostedSol.AzureDNSUI.Web.Settings;
using Serilog;
using Serilog.Core;

namespace HostedSol.AzureDNSUI.Web.Services
{
    public class Logger
    {
        private readonly Assembly _assembly = HostingEnvironment.IsHosted
            ? BuildManager.GetGlobalAsaxType().BaseType.Assembly
            : Assembly.GetEntryAssembly()
              ?? Assembly.GetExecutingAssembly();
        private readonly EnvironmentSetting _environmentSetting;
        private readonly SeqServerUrl _seqServerUrl;

        public Logger(EnvironmentSetting environmentSetting, SeqServerUrl seqServerUrl)
        {
            _environmentSetting = environmentSetting;
            _seqServerUrl = seqServerUrl;
            Log.Logger = new LoggerConfiguration()
              .Enrich.FromLogContext()
                .Enrich.WithMachineName()
                .Enrich.WithThreadId()
                .Enrich.WithProcessId()
                .Enrich.WithProperty("ApplicationName", _assembly.GetName().Name)
                .Enrich.WithProperty("ApplicationVersion", _assembly.GetName().Version)
                .Enrich.WithProperty("EnvironmentName", _environmentSetting)
                .WriteTo.ColoredConsole()
                .WriteTo.Seq(_seqServerUrl.ToString())
                .WriteTo.Trace()
              .CreateLogger();
        }
    }
}