package org.zeron.sophon.web.config.controller;

import org.zeron.sophon.authn.SignPrincipal;
import org.zeron.sophon.authn.web.AuthorizationUtils;
import org.zeron.sophon.authn.annotation.CurrentUser;
import org.zeron.sophon.entity.Institutions;
import org.zeron.sophon.entity.Message;
import org.zeron.sophon.entity.idm.UserInfo;
import org.zeron.sophon.persistence.service.InstitutionsService;
import org.dromara.mybatis.jpa.entity.JpaPageResults;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.Arrays;
import java.util.List;

import org.zeron.sophon.web.WebConstants;
import org.zeron.sophon.web.WebContext;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping(value={"/config/institutions"})
public class InstitutionsController {
        static final  Logger logger = LoggerFactory.getLogger(InstitutionsController.class);
        
        @Autowired
        InstitutionsService institutionsService;

        @RequestMapping(value={"/switch/{instId}"}, produces = {MediaType.APPLICATION_JSON_VALUE})
        public Message<?> switchTenant(@PathVariable("instId") String instId, @CurrentUser UserInfo currentUser, HttpServletRequest request) {
            logger.debug("Switch to tenant instId: {}", instId);
            
            // 校验 instId 是否存在
            Institutions institutions = institutionsService.get(instId);
            if (institutions == null) {
                return new Message<>(Message.FAIL, "Institution not found");
            }
            
            // 更新 Session 中的 CURRENT_INST
            request.getSession().setAttribute(WebConstants.CURRENT_INST, institutions);
            
            // 更新 CurrentUser 中的 instId (这会影响后续 Controller ??@CurrentUser 获取到的??
            currentUser.setInstId(instId);
            // 还需要更??Authentication 中的 UserInfo，但这通常较复杂�?
            // 简单做法是依赖 filter 每次??session 重新构建上下文，或者只需更新 session 即可??
            
            // 某些架构可能需要更??UserInfo 并重??setSession
            Authentication authentication = AuthorizationUtils.getAuthentication();
            if(authentication != null && authentication.getPrincipal() instanceof SignPrincipal) {
                SignPrincipal signPrincipal = (SignPrincipal) authentication.getPrincipal();
                signPrincipal.setUserInfo(currentUser);
                signPrincipal.setInstId(instId);
                AuthorizationUtils.setAuthentication(authentication);
            }

            return new Message<>(Message.SUCCESS);
        }
        
        @RequestMapping(value = { "/fetch" }, produces = {MediaType.APPLICATION_JSON_VALUE})
        public Message<JpaPageResults<Institutions>> fetch(
                @ModelAttribute Institutions institutions,
                @CurrentUser UserInfo currentUser) {
            logger.debug("fetch {}",institutions);
            return new Message<>(institutionsService.fetchPageResults(institutions));
        }

        @RequestMapping(value={"/get/{id}"}, produces = {MediaType.APPLICATION_JSON_VALUE})
        public Message<Institutions> get(@PathVariable("id") String id) {
            Institutions institutions = institutionsService.get(id);
            return new Message<Institutions>(institutions);
        }

        @RequestMapping(value={"/add"}, produces = {MediaType.APPLICATION_JSON_VALUE})
        public Message<Institutions> add(@RequestBody Institutions institutions,@CurrentUser UserInfo currentUser) {
            logger.debug("add institutions : {}" , institutions);
            if(institutionsService.insert(institutions)) {
                 return new Message<Institutions>(Message.SUCCESS);
            } else {
                 return new Message<Institutions>(Message.FAIL);
            }
        }

        @RequestMapping(value={"/delete"}, produces = {MediaType.APPLICATION_JSON_VALUE})
        public Message<Institutions> delete(@RequestParam("ids") String ids,@CurrentUser UserInfo currentUser) {
            logger.debug("delete institutions ids : {}" , ids);
            List<String> idList = Arrays.asList(ids.split(","));
            if(institutionsService.deleteBatch(idList)) {
                 return new Message<Institutions>(Message.SUCCESS);
            } else {
                 return new Message<Institutions>(Message.FAIL);
            }
        }

        @RequestMapping(value={"/get"}, produces = {MediaType.APPLICATION_JSON_VALUE})
        public Message<?> get(@CurrentUser UserInfo currentUser){
            Institutions institutions = institutionsService.get(currentUser.getInstId());
            return new Message<Institutions>(Message.SUCCESS,institutions);
        }
        
        @RequestMapping(value={"/update"}, produces = {MediaType.APPLICATION_JSON_VALUE})
        public Message<?> update(
                @RequestBody  Institutions institutions,
                @CurrentUser UserInfo currentUser,
                BindingResult result) {
            logger.debug("updateRole institutions : {}" , institutions);
            if(institutionsService.update(institutions)) {
                // 更新成功后清除缓??
                institutionsService.clearInstitutionsCache(institutions.getId());
                logger.debug("Cleared institutions cache for id: {}", institutions.getId());
                return new Message<Institutions>(Message.SUCCESS);
            } else {
                return new Message<Institutions>(Message.FAIL);
            }
        }
}

