using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Autofac.Integration.WebApi;
using HostedSol.AzureDNSUI.Web.Services;
using Serilog;

namespace HostedSol.AzureDNSUI.Web.Controllers
{
    [AutofacControllerConfiguration]
    public class LogController : ApiController
    {
        private readonly ILogger _logger;

        public LogController(ILogger logger)
        {
            _logger = logger;
        }

        [Route("~/api/Log/Error")]
        [HttpPost]
        // POST: api/Log/Error
        public void PostError([FromBody]string value)
        {
            _logger.Error(value);
        }
        [Route("~/api/Log/Debug")]
        [HttpPost]
        // POST: api/Log/Debug
        public void PostDebug([FromBody]string value)
        {
            _logger.Debug(value);
        }
        [Route("~/api/Log/Warn")]
        [HttpPost]
        // POST: api/Log/Warn
        public void PostWarn([FromBody]string value)
        {
            _logger.Warning(value);
        }
        [Route("~/api/Log/Info")]
        [HttpPost]
        // POST: api/Log/Info
        public void PostInfo([FromBody]string value)
        {
            _logger.Information(value);
        }
    }
}
