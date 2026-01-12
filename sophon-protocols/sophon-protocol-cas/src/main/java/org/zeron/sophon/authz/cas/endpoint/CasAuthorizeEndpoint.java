package org.zeron.sophon.authz.cas.endpoint;

import java.security.Principal;
import java.util.Map;
import java.util.Map.Entry;

import org.zeron.sophon.authn.session.VisitedDto;
import org.zeron.sophon.authn.web.AuthorizationUtils;
import org.zeron.sophon.authz.cas.endpoint.ticket.CasConstants;
import org.zeron.sophon.authz.cas.endpoint.ticket.ServiceTicketImpl;
import org.zeron.sophon.authz.singlelogout.LogoutType;
import org.zeron.sophon.entity.apps.AppsCasDetails;
import org.zeron.sophon.web.WebConstants;
import org.zeron.sophon.web.WebContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * @author yi.min
 * https://apereo.github.io/cas/6.2.x/protocol/CAS-Protocol.html
 */
@Tag(name = "2-3-CAS API文档模块")
@Controller
public class CasAuthorizeEndpoint extends CasBaseAuthorizeEndpoint{

    static final  Logger _logger = LoggerFactory.getLogger(CasAuthorizeEndpoint.class);
    
    @Operation(summary = "CAS页面跳转service认证接口", description = "传递参数service",method="GET")
    @GetMapping(CasConstants.ENDPOINT.ENDPOINT_LOGIN)
    public ModelAndView casLogin(@RequestParam(value=CasConstants.PARAMETER.SERVICE,required=false) String casService,
                                 HttpServletRequest request,
                                 HttpServletResponse response
            ){
        
        AppsCasDetails  casDetails = casDetailsService.getAppDetails(casService , true);
        
        return buildCasModelAndView(request,response,casDetails,casService);
    }
    
    @Operation(summary = "CAS页面跳转应用ID认证接口", description = "传递参数应用ID",method="GET")
    @GetMapping(CasConstants.ENDPOINT.ENDPOINT_BASE + "/{id}")
    public ModelAndView authorize(  @PathVariable("id") String id,
                                    HttpServletRequest request,
                                    HttpServletResponse response
            ){
        
        AppsCasDetails casDetails = casDetailsService.getAppDetails(id , true);
        
        return buildCasModelAndView(request,response,casDetails,casDetails == null ? id : casDetails.getCallbackUrl());
    }
    
    private  ModelAndView buildCasModelAndView( HttpServletRequest request,
                                                HttpServletResponse response,
                                                AppsCasDetails casDetails,
                                                String casService){
        if(casDetails == null) {
            _logger.debug("service {} not registered  " , casService);
            ModelAndView modelAndView = new ModelAndView("authorize/cas_sso_submint");
            modelAndView.addObject("errorMessage", casService);
            return modelAndView;
        }
        
        _logger.debug("Detail {}" , casDetails);
        Map<String, String> parameterMap = WebContext.getRequestParameterMap(request);
        String service = casService;
        _logger.debug("CAS Parameter service = {}" , service);
        if(casService.indexOf("?") >-1 ) {
            service = casService.substring(casService.indexOf("?") + 1);
            if(service.indexOf("=") > -1) {
                String [] parameterValues = service.split("=");
                if(parameterValues.length == 2) {
                    parameterMap.put(parameterValues[0], parameterValues[1]);
                }
            }
            _logger.debug("CAS service with Parameter : {}" , parameterMap);
        }
        WebContext.setAttribute(CasConstants.PARAMETER.PARAMETER_MAP, parameterMap);
        WebContext.setAttribute(CasConstants.PARAMETER.ENDPOINT_CAS_DETAILS, casDetails);
        WebContext.setAttribute(WebConstants.SINGLE_SIGN_ON_APP_ID, casDetails.getId());
        WebContext.setAttribute(WebConstants.AUTHORIZE_SIGN_ON_APP,casDetails);
        return WebContext.redirect(CasConstants.ENDPOINT.ENDPOINT_SERVICE_TICKET_GRANTING);
        
    }
    
    @GetMapping(CasConstants.ENDPOINT.ENDPOINT_SERVICE_TICKET_GRANTING)
    public ModelAndView grantingTicket( Principal principal,
                                        HttpServletRequest request,
                                        HttpServletResponse response){
        ModelAndView modelAndView = new ModelAndView("authorize/cas_sso_submint");
        AppsCasDetails casDetails = (AppsCasDetails)WebContext.getAttribute(CasConstants.PARAMETER.ENDPOINT_CAS_DETAILS);
        
        ServiceTicketImpl serviceTicket = new ServiceTicketImpl(AuthorizationUtils.getAuthentication(),casDetails);
        
        _logger.trace("CAS start create ticket ... ");
        String ticket = ticketServices.createTicket(serviceTicket,casDetails.getExpires());
        _logger.trace("CAS ticket {} created . " , ticket);
        
        StringBuffer callbackUrl = new StringBuffer(casDetails.getCallbackUrl());
        if(casDetails.getCallbackUrl().indexOf("?")==-1) {
            callbackUrl.append("?");
        }
        
        if(callbackUrl.indexOf("&") != -1 ||callbackUrl.indexOf("=") != -1) {
            callbackUrl.append("&");
        }
        
        //append ticket
        callbackUrl.append(CasConstants.PARAMETER.TICKET).append("=").append(ticket);
        
        callbackUrl.append("&");
        //append service
        callbackUrl.append(CasConstants.PARAMETER.SERVICE).append("=").append(casDetails.getService());
        
        //增加可自定义的参??
        if(WebContext.getAttribute(CasConstants.PARAMETER.PARAMETER_MAP)!=null) {
            @SuppressWarnings("unchecked")
            Map <String, String> parameterMap = (Map <String, String>)WebContext.getAttribute(CasConstants.PARAMETER.PARAMETER_MAP);
            parameterMap.remove(CasConstants.PARAMETER.TICKET);
            parameterMap.remove(CasConstants.PARAMETER.SERVICE);
            for (Entry<String, String> entry : parameterMap.entrySet()) {
                callbackUrl.append("&").append(entry.getKey()).append("=").append(entry.getValue());
            }
        }
        
        if(casDetails.getLogoutType()==LogoutType.BACK_CHANNEL) {
            _logger.debug("CAS LogoutType BACK_CHANNEL ... ");
            String sessionId = AuthorizationUtils.getPrincipal().getSessionId();
            VisitedDto visited = new VisitedDto(casDetails,ticket);
            sessionManager.visited(sessionId, visited);
            _logger.debug("App id {} , name {} , CAS LogoutType BACK_CHANNEL ... " , casDetails.getId(),casDetails.getAppName());
        }
        
        _logger.debug("redirect to CAS Client URL {}" , callbackUrl);
        modelAndView.addObject("callbackUrl", callbackUrl.toString());
        return modelAndView;
    }
    
}

