using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Routing;
using System.Web.SessionState;

namespace HostedSol.AzureDNSUI.Web
{
    public class WebApiApplication : System.Web.HttpApplication
    {
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
            GlobalConfiguration.Configure(WebApiConfig.Register);
        }
    }
}
