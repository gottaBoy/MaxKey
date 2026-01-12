package org.zeron.sophon.authz.cas.endpoint;


import org.apache.commons.lang3.StringUtils;
import org.zeron.sophon.authn.LoginCredential;
import org.zeron.sophon.authn.provider.AbstractAuthenticationProvider;
import org.zeron.sophon.authn.web.AuthorizationUtils;
import org.zeron.sophon.authz.cas.endpoint.ticket.CasConstants;
import org.zeron.sophon.authz.cas.endpoint.ticket.ServiceTicketImpl;
import org.zeron.sophon.authz.cas.endpoint.ticket.TicketGrantingTicketImpl;
import org.zeron.sophon.entity.apps.AppsCasDetails;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * @author yi.min
 * https://apereo.github.io/cas/6.2.x/protocol/REST-Protocol.html
 */
@Tag(name = "2-4-CAS REST API文档模块")
@Controller
public class CasRestV1Endpoint  extends CasBaseAuthorizeEndpoint{
    static final Logger _logger = LoggerFactory.getLogger(CasRestV1Endpoint.class);
    
    @Autowired
    @Qualifier("authenticationProvider")
    AbstractAuthenticationProvider authenticationProvider ;
    
    @Operation(summary = "CAS REST认证接口", description = "通过用户名密码获取TGT",method="POST")
    @PostMapping(value=CasConstants.ENDPOINT.ENDPOINT_REST_TICKET_V1, 
                 consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<String> casLoginRestTickets(
            HttpServletRequest request,
            HttpServletResponse response,
            @RequestParam(value=CasConstants.PARAMETER.SERVICE,required=false) String casService,
            @RequestParam(value=CasConstants.PARAMETER.REST_USERNAME,required=true) String username,
            @RequestParam(value=CasConstants.PARAMETER.REST_PASSWORD,required=true) String password){
        try {
            if (StringUtils.isBlank(password)) {
                throw new BadCredentialsException("No credentials are provided or extracted to authenticate the REST request");
            }
            
            LoginCredential loginCredential =new LoginCredential(username,password,"normal");
            
            Authentication  authentication  = authenticationProvider.authenticate(loginCredential);
            if(authentication == null) {
                _logger.debug("Bad Credentials Exception");
                return new ResponseEntity<>("Bad Credentials", HttpStatus.BAD_REQUEST);
            }
            
            TicketGrantingTicketImpl ticketGrantingTicket=new TicketGrantingTicketImpl("Random",AuthorizationUtils.getAuthentication(),null);
            
            String ticket=casTicketGrantingTicketServices.createTicket(ticketGrantingTicket);
            String location = applicationConfig.getServerPrefix()+CasConstants.ENDPOINT.ENDPOINT_REST_TICKET_V1 +"/" + ticket;
            HttpHeaders headers = new HttpHeaders();
            headers.add("location", location);
            _logger.trace("ticket {}" , ticket);
            _logger.trace("location {}" , location);
            return new ResponseEntity<>("Location: " + location, headers ,HttpStatus.CREATED);
 
        } catch (final AuthenticationException e) {
            _logger.error("BadCredentialsException ", e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (final Exception e) {
            _logger.error("Exception ", e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @Operation(summary = "CAS REST认证接口", description = "通过TGT获取ST",method="POST")
    @PostMapping(value=CasConstants.ENDPOINT.ENDPOINT_REST_TICKET_V1+"/{ticketGrantingTicket}", 
                consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<String> requestServiceTicket(
                HttpServletRequest request,
                HttpServletResponse response,
                @PathVariable("ticketGrantingTicket") String ticketGrantingTicket,
                @RequestParam(value=CasConstants.PARAMETER.SERVICE) String casService,
                @RequestParam(value=CasConstants.PARAMETER.RENEW,required=false) String renew,
                @RequestParam(value=CasConstants.PARAMETER.REST_USERNAME,required=false) String username,
                @RequestParam(value=CasConstants.PARAMETER.REST_PASSWORD,required=false) String password){
           try {
            TicketGrantingTicketImpl ticketGrantingTicketImpl = 
                    (TicketGrantingTicketImpl) casTicketGrantingTicketServices.get(ticketGrantingTicket);
            
            AppsCasDetails  casDetails=casDetailsService.getAppDetails(casService , true);
            
            ServiceTicketImpl serviceTicket=new ServiceTicketImpl(ticketGrantingTicketImpl.getAuthentication(),casDetails);
            String ticket = ticketServices.createTicket(serviceTicket);
            return new ResponseEntity<>(ticket, HttpStatus.OK);
            
        } catch (Exception e) {
            e.printStackTrace();
        }
           return new ResponseEntity<>("", HttpStatus.BAD_REQUEST);
       }
    @Operation(summary = "CAS REST认证接口", description = "检查TGT状态")
    @GetMapping(value=CasConstants.ENDPOINT.ENDPOINT_REST_TICKET_V1 + "/{ticketGrantingTicket}")
    public ResponseEntity<String> verifyTicketGrantingTicketStatus(
                @PathVariable("ticketGrantingTicket") String ticketGrantingTicket,
                HttpServletRequest request,
                HttpServletResponse response){
           try {
            TicketGrantingTicketImpl ticketGrantingTicketImpl = 
                       (TicketGrantingTicketImpl) casTicketGrantingTicketServices.get(ticketGrantingTicket);
                if(ticketGrantingTicketImpl != null) {
                    return new ResponseEntity<>("", HttpStatus.OK);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
           return new ResponseEntity<>("", HttpStatus.NOT_FOUND);
    }
    
    @Operation(summary = "CAS REST认证接口", description = "注销TGT状态")
    @DeleteMapping(value=CasConstants.ENDPOINT.ENDPOINT_REST_TICKET_V1+"/{ticketGrantingTicket}")
    public ResponseEntity<String> destroyTicketGrantingTicket(
            @PathVariable("ticketGrantingTicket") String ticketGrantingTicket,
            HttpServletRequest request,
            HttpServletResponse response){
       try {
        TicketGrantingTicketImpl ticketGrantingTicketImpl = 
                   (TicketGrantingTicketImpl) casTicketGrantingTicketServices.remove(ticketGrantingTicket);
            if(ticketGrantingTicketImpl != null) {
                return new ResponseEntity<>("", HttpStatus.OK);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
       return new ResponseEntity<>("", HttpStatus.NOT_FOUND);
    }
    
}

