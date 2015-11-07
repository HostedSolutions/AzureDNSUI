using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace HostedSol.AzureDNSUI.Web.Controllers
{
    public class SessionController : ApiController
    {
        // GET api/<controller>
        public IQueryable<KeyValuePair<string,string>> Get()
        {
            var rtn = new List<KeyValuePair<string, string>>();
            var del = HttpContext.Current.Session;

            foreach (string s in del.Keys)
            {
                rtn.Add(new KeyValuePair<string, string>(s,del[s].ToString()));
            }
            return rtn.AsQueryable();
        }

        // GET api/<controller>/5
        public string Get(string id)
        {
            if (HttpContext.Current.Session[id] != null)
            {
                return HttpContext.Current.Session[id].ToString();
            }
            else
            {
                return "";
            }
        }

        // POST api/<controller>
        public void Post(string id, [FromBody]string value)
        {
            HttpContext.Current.Session[id] = value;
        }

        // PUT api/<controller>/5
        public void Put(string id, [FromBody]string value)
        {
            HttpContext.Current.Session[id] = value;
        }

        // DELETE api/<controller>/5
        public void Delete(string id)
        {
            HttpContext.Current.Session[id]=null;
        }
    }
}