/*
 * Copyright [2024] [Sophon of copyright http://www.sophon.console]
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
 

package org.zeron.sophon.web;

import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.UnexpectedTypeException;
import org.zeron.sophon.entity.Message;
import org.zeron.sophon.exception.BusinessException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.util.List;
import java.util.Objects;

/**
 * @description:
 * @author: orangeBabu
 * @time: 16/8/2024 PM3:02
 */

/**
 * 全局异常处理??
 *
 */
@RestControllerAdvice
public class GlobalExceptionHandler {
     private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * 缺少请求体异常处理器
     * @param e 缺少请求体异??使用get方式请求 而实体使用@RequestBody修饰
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public Message<Void> parameterBodyMissingExceptionHandler(HttpMessageNotReadableException e, HttpServletRequest request) {
        String requestURI = request.getRequestURI();
        logger.error("Request URI '{}', request body missing '{}'", requestURI, e.getMessage(),e);
        return new Message<>(Message.FAIL, "Request body missing");
    }

    // get请求的对象参数校验异??
    @ExceptionHandler({MissingServletRequestParameterException.class})
    public Message<Void> bindExceptionHandler(MissingServletRequestParameterException e,HttpServletRequest request) {
        String requestURI = request.getRequestURI();
        logger.error("Request URI '{}', missing required parameter '{}'", requestURI, e.getMessage(),e);
        return new Message<>(Message.FAIL, "Missing required parameter");
    }

    /**
     * 请求方式不支??
     */
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public Message<Void> handleHttpRequestMethodNotSupported(HttpRequestMethodNotSupportedException e, HttpServletRequest request) {
        String requestURI = request.getRequestURI();
        logger.error("请求地址 '{}',不支??{}' 请求", requestURI, e.getMethod(),e);
        return new Message<>(HttpStatus.METHOD_NOT_ALLOWED.value(),HttpStatus.METHOD_NOT_ALLOWED.getReasonPhrase());
    }




    /**
     * 参数不正??
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public Message<Void> methodArgumentTypeMismatchException(MethodArgumentTypeMismatchException e, HttpServletRequest request) {
        String requestURI = request.getRequestURI();
        String error = String.format("%s should be of type %s", e.getName(), e.getRequiredType().getSimpleName());
        logger.error("Request URI '{}', {}, parameter type mismatch", requestURI,error,e);
        return new Message<>(Message.FAIL, "Parameter type mismatch");
    }

    /**
     * 系统异常
     */
    @ExceptionHandler(Exception.class)
    public Message<Void> handleException(Exception e, HttpServletRequest request) {
        String requestURI = request.getRequestURI();
        logger.info("Request IpAddress : {} " , WebContext.getRequestIpAddress(request));
        if(e instanceof NoHandlerFoundException) {
            //NoHandlerFoundException
        }else {
            logger.error("请求地址'{}',发生系统异常.", requestURI, e);
        }
        return new Message<>(Message.FAIL, HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase());
    }

    /**
     * 捕获转换类型异常
     * @param e
     * @return
     */
    @ExceptionHandler(UnexpectedTypeException.class)
    public Message<String> unexpectedTypeHandler(UnexpectedTypeException e)
    {
        logger.error("类型转换错误：{}",e.getMessage(), e);
        return  new Message<>(HttpStatus.INTERNAL_SERVER_ERROR.value(),e.getMessage());
    }

    /**
     * 捕获转换类型异常
     * @param e
     * @return
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Message<String> methodArgumentNotValidException(MethodArgumentNotValidException e)
    {
        BindingResult bindingResult =  e.getBindingResult();
        List<ObjectError> errors = bindingResult.getAllErrors();
        logger.error("参数验证异常：{}",e.getMessage(), e);
        if (!errors.isEmpty()) {
            // 只显示第一个错误信??
            return new Message<>(HttpStatus.BAD_REQUEST.value(), errors.get(0).getDefaultMessage());
        }
        return new Message<>(HttpStatus.BAD_REQUEST.value(),"MethodArgumentNotValid");
    }

    // 运行时异??
    @ExceptionHandler(RuntimeException.class)
    public Message<String> runtimeExceptionHandler(RuntimeException e, HttpServletRequest request) {
        String requestURI = request.getRequestURI();
        logger.error("请求地址'{}',捕获运行时异??{}'", requestURI, e.getMessage(),e);
        return new Message<>(Message.FAIL, e.getMessage());
    }
    // 系统级别异常
    @ExceptionHandler(Throwable.class)
    public Message<String> throwableExceptionHandler(Throwable e,HttpServletRequest request) {
        String requestURI = request.getRequestURI();
        logger.error("请求地址'{}',捕获系统级别异常'{}'", requestURI,e.getMessage(),e);
        return new Message<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage());
    }

    /**
     * IllegalArgumentException 捕获转换类型异常
     * @param e
     * @return
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public Message<String> illegalArgumentException(IllegalArgumentException e)
    {
        String message = e.getMessage();
        logger.error("IllegalArgumentException：{}",e.getMessage(),e);
        if (Objects.nonNull(message)) {
            //错误信息
            return new Message<>(HttpStatus.BAD_REQUEST.value(),message);
        }
        return  new Message<>(HttpStatus.BAD_REQUEST.value(),"error");
    }
    /**
     * InvalidFormatException 捕获转换类型异常
     * @param e
     * @return
     */
    @ExceptionHandler(InvalidFormatException.class)
    public Message<String> invalidFormatException(InvalidFormatException e)
    {
        String message = e.getMessage();
        logger.error("InvalidFormatException：{}",e.getMessage(),e);
        if (Objects.nonNull(message)) {
            //错误信息
            return new Message<>(HttpStatus.BAD_REQUEST.value(),message);
        }
        return new Message<>(HttpStatus.BAD_REQUEST.value(),"error");
    }



    /**
     * 自定义验证异??
     */
    @ExceptionHandler(BindException.class)
    public Message<Void> handleBindException(BindException e) {
        BindingResult bindingResult =  e.getBindingResult();
        List<ObjectError> errors = bindingResult.getAllErrors();
        logger.error("参数验证异常：{}",e.getMessage(), e);
        if (!errors.isEmpty()) {
            // 只显示第一个错误信??
            return new Message<>(HttpStatus.BAD_REQUEST.value(), errors.get(0).getDefaultMessage());
        }
        return new Message<>(HttpStatus.BAD_REQUEST.value(),"MethodArgumentNotValid");
    }

    /**
     * 业务异常处理
     * 业务自定义code ??message
     *
     */
    @ExceptionHandler(BusinessException.class)
    public Message<String> handleBusinessException(BusinessException e) {
        logger.error("业务自定义异??{},{}",e.getCode(),e.getMessage(),e);
        return new Message<>(e.getCode(),e.getMessage());
    }
}

