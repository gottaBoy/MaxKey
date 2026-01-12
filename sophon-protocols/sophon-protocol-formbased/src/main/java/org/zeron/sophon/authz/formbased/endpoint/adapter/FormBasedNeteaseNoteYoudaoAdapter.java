/*
 * Copyright [2020] [Sophon of copyright http://www.sophon.console]
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 

package org.zeron.sophon.authz.formbased.endpoint.adapter;

import java.util.Date;

import org.zeron.sophon.authz.endpoint.adapter.AbstractAuthorizeAdapter;
import org.zeron.sophon.crypto.DigestUtils;
import org.zeron.sophon.entity.apps.AppsFormBasedDetails;
import org.springframework.web.servlet.ModelAndView;

public class FormBasedNeteaseNoteYoudaoAdapter extends AbstractAuthorizeAdapter {

    @Override
    public Object generateInfo() {
        return null;
    }


    @Override
    public ModelAndView authorize(ModelAndView modelAndView) {
        modelAndView.setViewName("authorize/formbased_wy_youdao_sso_submint");
        AppsFormBasedDetails details=(AppsFormBasedDetails)app;
        modelAndView.addObject("username", account.getRelatedUsername());
        modelAndView.addObject("password",  DigestUtils.md5Hex(account.getRelatedPassword()));
        modelAndView.addObject("currentTime",  (new Date()).getTime());
        return modelAndView;
    }

}

