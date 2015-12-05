using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;
using System.Web.SessionState;
using Autofac;
using Autofac.Integration.Mvc;
using Autofac.Integration.WebApi;
using AutofacSerilogIntegration;
using HostedSol.AzureDNSUI.Web.Controllers;
using HostedSol.AzureDNSUI.Web.Services;
using Serilog;

namespace HostedSol.AzureDNSUI.Web
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        public static ILogger _log;

        
        protected void Application_PostAuthorizeRequest()
        {
            if (IsWebApiRequest())
            {
                HttpContext.Current.SetSessionStateBehavior(SessionStateBehavior.Required);
            }
        }

        private bool IsWebApiRequest()
        {
            return HttpContext.Current.Request.AppRelativeCurrentExecutionFilePath.StartsWith("~/api");
        }
        protected void Application_AcquireRequestState()
        {
            if (HttpContext.Current.Session != null)
            {
                if (Request.Form["id_token"] != null)
                {
                    Session["id_token"] = Request.Form["id_token"];
                }
            }
        }
        protected void Application_Start()
        {
            var builder = new ContainerBuilder();

            // Get your HttpConfiguration.
            var config = GlobalConfiguration.Configuration;

            // Register your Web API controllers.
            builder.RegisterApiControllers(Assembly.GetExecutingAssembly());

            // OPTIONAL: Register the Autofac filter provider.
            builder.RegisterWebApiFilterProvider(config);

            builder.RegisterType<LogController>().InstancePerRequest();
            builder.RegisterType<SessionController>().InstancePerRequest();
            builder.RegisterType<Logger>();
            builder.RegisterLogger();
            builder.RegisterModule<Settings.ConfigurationModule>();

            // Set the dependency resolver to be Autofac.
            var container = builder.Build();
            config.DependencyResolver = new AutofacWebApiDependencyResolver(container);
            GlobalConfiguration.Configure(WebApiConfig.Register);


            //  var container = builder.Build();

            //configure logger
            container.Resolve<Logger>();

            // DependencyResolver.SetResolver(new AutofacDependencyResolver(container));
            // Create the depenedency resolver.
            //  var resolver = new AutofacWebApiDependencyResolver(container);

            // Configure Web API with the dependency resolver.
            //  GlobalConfiguration.Configuration.DependencyResolver = resolver;
        }
    }
}
