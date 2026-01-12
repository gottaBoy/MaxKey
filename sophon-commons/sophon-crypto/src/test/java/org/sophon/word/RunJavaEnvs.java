/*
 * Copyright [2022] [Sophon of copyright http://www.sophon.console]
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
 

package org.sophon.word;

import java.util.Iterator;
import java.util.Map;
import java.util.Properties;

import org.apache.commons.lang.SystemUtils;
import org.apache.commons.lang3.ArchUtils;

public class RunJavaEnvs {

    public static void main(String[] args) {
        Map<String, String> map = System.getenv();
        for(Iterator<String> itr = map.keySet().iterator();itr.hasNext();){
            String key = itr.next();
            System.out.println(key + "=" + map.get(key));
        } 
        
        System.out.println(SystemUtils.JAVA_VENDOR);
        System.out.println(SystemUtils.JAVA_COMPILER);
        System.out.println(SystemUtils.JAVA_VERSION);
        System.out.println(SystemUtils.JAVA_HOME);
        
        System.out.println("JAVA_CLASS_VERSION :"+SystemUtils.JAVA_CLASS_VERSION);
        
        System.out.println(SystemUtils.JAVA_SPECIFICATION_VERSION);
        System.out.println(SystemUtils.JAVA_SPECIFICATION_NAME);
        System.out.println(SystemUtils.JAVA_SPECIFICATION_VENDOR);
        
        System.out.println("JAVA_VM_INFO :"+SystemUtils.JAVA_VM_INFO);
        System.out.println(SystemUtils.JAVA_VM_INFO);
        System.out.println(SystemUtils.JAVA_VM_NAME);
        System.out.println(SystemUtils.JAVA_VM_VENDOR);
        System.out.println(SystemUtils.JAVA_VM_VERSION);
        
        System.out.println(SystemUtils.OS_NAME);
        System.out.println(SystemUtils.OS_ARCH);
        System.out.println(SystemUtils.OS_VERSION);

        System.out.println("OS : "+SystemUtils.OS_NAME +"("+SystemUtils.OS_ARCH+" " +ArchUtils.getProcessor().getType()+"), version " +SystemUtils.OS_VERSION+"");
        System.out.println("JAVA : "+SystemUtils.JAVA_VENDOR+" java version "+SystemUtils.JAVA_VERSION +", class "+SystemUtils.JAVA_CLASS_VERSION);
        System.out.println("JAVA_VM : "+SystemUtils.JAVA_VM_NAME+" (build "+SystemUtils.JAVA_VM_VERSION +", "+ SystemUtils.JAVA_VM_INFO+")");
    
        Properties props=System.getProperties();  
        System.out.println("Java Environment Version: "+props.getProperty("java.version"));  
        System.out.println("Java Environment Vendor: "+props.getProperty("java.vendor"));  
        System.out.println("Java Vendor URL: "+props.getProperty("java.vendor.url"));  
        System.out.println("Java Install Path: "+props.getProperty("java.home"));  
        System.out.println("Java VM Spec Version: "+props.getProperty("java.vm.specification.version"));  
        System.out.println("Java VM Spec Vendor: "+props.getProperty("java.vm.specification.vendor"));  
        System.out.println("Java VM Spec Name: "+props.getProperty("java.vm.specification.name"));  
        System.out.println("Java VM Impl Version: "+props.getProperty("java.vm.version"));  
        System.out.println("Java VM Impl Vendor: "+props.getProperty("java.vm.vendor"));  
        System.out.println("Java VM Impl Name: "+props.getProperty("java.vm.name"));  
        System.out.println("Java Runtime Spec Version: "+props.getProperty("java.specification.version"));  
        System.out.println("Java Runtime Spec Vendor: "+props.getProperty("java.specification.vender"));  
        System.out.println("Java Runtime Spec Name: "+props.getProperty("java.specification.name"));  
        System.out.println("Java Class Format Version: "+props.getProperty("java.class.version"));  
        System.out.println("Java Class Path: "+props.getProperty("java.class.path"));  
        System.out.println("Library Search Path: "+props.getProperty("java.library.path"));  
        System.out.println("Temp File Path: "+props.getProperty("java.io.tmpdir"));  
        System.out.println("Extension Dirs: "+props.getProperty("java.ext.dirs"));  
        System.out.println("OS Name: "+props.getProperty("os.name"));  
        System.out.println("OS Arch: "+props.getProperty("os.arch"));  
        System.out.println("OS Version: "+props.getProperty("os.version"));  
        System.out.println("File Separator: "+props.getProperty("file.separator"));
        System.out.println("Path Separator: "+props.getProperty("path.separator"));
        System.out.println("Line Separator: "+props.getProperty("line.separator"));
        System.out.println("User Account Name: "+props.getProperty("user.name"));  
        System.out.println("User Home Dir: "+props.getProperty("user.home"));  
        System.out.println("User Current Dir: "+props.getProperty("user.dir"));  
    }

}