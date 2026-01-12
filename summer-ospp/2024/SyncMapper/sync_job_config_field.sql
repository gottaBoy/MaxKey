/*
 Navicat Premium Data Transfer

 Source Server         : mysql80
 Source Server Type    : MySQL
 Source Server Version : 80038
 Source Host           : localhost:3306
 Source Schema         : Sophon

 Target Server Type    : MySQL
 Target Server Version : 80038
 File Encoding         : 65001

 Date: 26/09/2024 10:36:51
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for sync_job_config_field
-- ----------------------------
DROP TABLE IF EXISTS `sync_job_config_field`;
CREATE TABLE `sync_job_config_field`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `jobid` bigint NOT NULL DEFAULT 0 COMMENT '鍚屾浠诲姟ID',
  `name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '瑙勫垯鍚?,
  `objecttype` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '绫诲瀷',
  `targetfield` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '鐩爣瀛楁',
  `targetfieldname` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '鐩爣瀛楁鎻忚堪',
  `sourcefield` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '鏉ユ簮瀛楁',
  `sourcefieldname` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '鏉ユ簮瀛楁鎻忚堪',
  `description` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '鎻忚堪',
  `createuser` bigint NULL DEFAULT 0 COMMENT '鍒涘缓浜?,
  `createtime` datetime NULL DEFAULT NULL COMMENT '鍒涘缓鏃堕棿',
  `updateuser` bigint NULL DEFAULT 0 COMMENT '淇敼浜?,
  `updatetime` datetime NULL DEFAULT NULL COMMENT '淇敼鏃堕棿',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_job_id`(`jobid` ASC) USING BTREE COMMENT '鍚屾浠诲姟ID绱㈠紩'
) ENGINE = InnoDB AUTO_INCREMENT = 214 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '鍚屾浠诲姟瀛楁鏄犲皠琛? ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sync_job_config_field
-- ----------------------------
INSERT INTO `sync_job_config_field` VALUES (1, 3, NULL, '1', 'username', NULL, 'userid', NULL, '閽夐拤鐢ㄦ埛', NULL, NULL, NULL, NULL);
INSERT INTO `sync_job_config_field` VALUES (2, 3, NULL, '1', 'nickName', NULL, 'name', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `sync_job_config_field` VALUES (3, 3, NULL, '1', 'displayName', NULL, 'name', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `sync_job_config_field` VALUES (4, 3, NULL, '1', 'formattedName', NULL, 'name', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `sync_job_config_field` VALUES (5, 3, NULL, '1', 'email', NULL, 'email', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `sync_job_config_field` VALUES (6, 3, NULL, '1', 'entryDate', NULL, 'hiredDate', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `sync_job_config_field` VALUES (7, 3, NULL, '1', 'mobile', NULL, 'mobile', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `sync_job_config_field` VALUES (8, 3, NULL, '1', 'departmentId', NULL, 'objectId', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `sync_job_config_field` VALUES (9, 3, NULL, '1', 'department', NULL, 'objectName', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `sync_job_config_field` VALUES (10, 3, NULL, '1', 'employeeNumber', NULL, 'jobNumber', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `sync_job_config_field` VALUES (11, 3, NULL, '1', 'jobTitle', NULL, 'title', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `sync_job_config_field` VALUES (12, 3, NULL, '1', 'workEmail', NULL, 'orgEmail', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `sync_job_config_field` VALUES (13, 3, NULL, '1', 'workPhoneNumber', NULL, 'telephone', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `sync_job_config_field` VALUES (14, 3, NULL, '1', 'workOfficeName', NULL, 'workPlace', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `sync_job_config_field` VALUES (15, 3, NULL, '1', 'status', NULL, 'active', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `sync_job_config_field` VALUES (16, 3, '', '1', 'description', '', 'remark', '', '', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (17, 3, NULL, '2', 'id', NULL, 'deptId', NULL, '閽夐拤缁勭粐', NULL, NULL, NULL, NULL);
INSERT INTO `sync_job_config_field` VALUES (18, 3, NULL, '2', 'orgCode', NULL, 'deptId', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `sync_job_config_field` VALUES (19, 3, NULL, '2', 'orgName', NULL, 'name', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `sync_job_config_field` VALUES (20, 3, NULL, '2', 'parentId', NULL, 'objectId', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `sync_job_config_field` VALUES (21, 3, NULL, '2', 'parentCode', NULL, 'parentId', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `sync_job_config_field` VALUES (22, 3, NULL, '2', 'parentName', NULL, 'objectName', NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `sync_job_config_field` VALUES (23, 6, '', '1', 'username', '', 'user_id', '', '椋炰功鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (24, 6, '', '1', 'nickName', '', 'nickname', '', '', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (25, 6, '', '1', 'displayName', '', 'name', '', '', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (26, 6, '', '1', 'mobile', '', 'mobile', '', '', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (27, 6, '', '1', 'email', '', 'email', '', '', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (28, 6, '', '1', 'gender', '', 'gender', '', '', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (29, 6, '', '1', 'employeeNumber', '', 'employee_no', '', '', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (30, 6, '', '1', 'workPhoneNumber', '', 'mobile', '', '', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (31, 6, '', '1', 'department', '', 'objectName', '', '', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (32, 6, '', '1', 'jobTitle', '', 'job_title', '', '', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (33, 6, '', '1', 'workAddressFormatted', '', 'work_station', '', '', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (34, 6, '', '1', 'status', '', 'status', '', '', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (35, 6, '', '2', 'orgCode', '', 'department_id', '', '椋炰功缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (36, 6, '', '2', 'orgName', '', 'name', '', '椋炰功缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (37, 6, '', '2', 'fullName', '', 'name', '', '椋炰功缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (38, 6, '', '2', 'parentId', '', 'objectId', '', '椋炰功缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (39, 6, '', '2', 'parentName', '', 'objectName', '', '椋炰功缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (40, 6, '', '2', 'sortIndex', '', 'order', '', '椋炰功缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (41, 4, '', '1', 'username', '', 'userid', '', '浼佷笟寰俊鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (42, 4, '', '1', 'nickName', '', 'alias', '', '浼佷笟寰俊鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (43, 4, '', '1', 'displayName', '', 'name', '', '浼佷笟寰俊鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (44, 4, '', '1', 'mobile', '', 'mobile', '', '浼佷笟寰俊鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (45, 4, '', '1', 'email', '', 'email', '', '浼佷笟寰俊鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (46, 4, '', '1', 'gender', '', 'gender', '', '浼佷笟寰俊鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (47, 4, '', '1', 'workPhoneNumber', '', 'telephone', '', '浼佷笟寰俊鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (48, 4, '', '1', 'departmentId', '', 'main_department', '', '浼佷笟寰俊鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (49, 4, '', '1', 'jobTitle', '', 'position', '', '浼佷笟寰俊鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (50, 4, '', '1', 'workAddressFormatted', '', 'address', '', '浼佷笟寰俊鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (51, 4, '', '2', 'orgName', '', 'name', '', '浼佷笟寰俊缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (52, 4, '', '2', 'orgCode', '', 'id', '', '浼佷笟寰俊缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (53, 4, '', '2', 'parentId', '', 'objectId', '', '浼佷笟寰俊缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (54, 4, '', '2', 'parentName', '', 'objectName', '', '浼佷笟寰俊缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (55, 4, '', '2', 'sortIndex', '', 'order', '', '浼佷笟寰俊缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (56, 2, '', '1', 'department', '', 'orgName', '', 'AD鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (57, 2, '', '1', 'departmentId', '', 'id', '', 'AD鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (58, 2, '', '1', 'formattedName', '', 'cn', '', 'AD鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (59, 2, '', '1', 'username', '', 'sAMAccountname', '', 'AD鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (60, 2, '', '1', 'windowsAccount', '', 'sAMAccountname', '', 'AD鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (61, 2, '', '1', 'familyName', '', 'sn', '', 'AD鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (62, 2, '', '1', 'givenName', '', 'givenName', '', 'AD鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (63, 2, '', '1', 'nameZhShortSpell', '', 'initials', '', 'AD鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (64, 2, '', '1', 'nickName', '', 'initials', '', 'AD鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (65, 2, '', '1', 'displayName', '', 'displayName', '', 'AD鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (66, 2, '', '1', 'description', '', 'description', '', 'AD鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (67, 2, '', '1', 'workPhoneNumber', '', 'telephoneNumber', '', 'AD鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (68, 2, '', '1', 'workOfficeName', '', 'physicalDeliveryOfficeName', '', 'AD鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (69, 2, '', '1', 'workEmail', '', 'mail', '', 'AD鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (70, 2, '', '1', 'webSite', '', 'wwwHomePage', '', 'AD鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (71, 2, '', '1', 'workCountry', '', 'co', '', 'AD鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (72, 2, '', '1', 'workRegion', '', 'st', '', 'AD鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (73, 2, '', '1', 'workLocality', '', 'l', '', 'AD鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (74, 2, '', '1', 'workStreetAddress', '', 'streetAddress', '', 'AD鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (75, 2, '', '1', 'workPostalCode', '', 'postalCode', '', 'AD鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (76, 2, '', '1', 'workAddressFormatted', '', 'postOfficeBox', '', 'AD鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (77, 2, '', '1', 'mobile', '', 'mobile', '', 'AD鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (78, 2, '', '1', 'homePhoneNumber', '', 'homePhone', '', 'AD鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (79, 2, '', '1', 'workFax', '', 'facsimileTelephoneNumber', '', 'AD鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (80, 2, '', '1', 'homeAddressFormatted', '', 'info', '', 'AD鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (81, 2, '', '1', 'division', '', 'company', '', 'AD鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (82, 2, '', '1', 'jobTitle', '', 'title', '', 'AD鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (83, 2, '', '2', 'orgCode', '', 'id', '', 'AD缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (84, 2, '', '2', 'orgName', '', 'ou', '', 'AD缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (85, 2, '', '2', 'fullName', '', 'orgName', '', 'AD缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (86, 2, '', '2', 'country', '', 'co', '', 'AD缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (87, 2, '', '2', 'region', '', 'st', '', 'AD缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (88, 2, '', '2', 'locality', '', 'l', '', 'AD缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (89, 2, '', '2', 'street', '', 'street', '', 'AD缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (90, 2, '', '2', 'postalCode', '', 'postalCode', '', 'AD缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (91, 2, '', '2', 'description', '', 'description', '', 'AD缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (92, 1, '', '1', 'department', '', 'orgName', '', 'LDAP鐢ㄦ埛', 0, NULL, 0, '2024-09-24 04:06:12');
INSERT INTO `sync_job_config_field` VALUES (93, 1, '', '1', 'departmentId', '', 'id', '', 'LDAP鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (94, 1, '', '1', 'formattedName', '', 'givenName', '', 'LDAP鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (95, 1, '', '1', 'username', '', 'uid', '', 'LDAP鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (96, 1, '', '1', 'windowsAccount', '', 'uid', '', 'LDAP鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (97, 1, '', '1', 'familyName', '', 'sn', '', 'LDAP鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (98, 1, '', '1', 'givenName', '', 'givenName', '', 'LDAP鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (99, 1, '', '1', 'nickName', '', 'initials', '', 'LDAP鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (100, 1, '', '1', 'nameZhShortSpell', '', 'initials', '', 'LDAP鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (101, 1, '', '1', 'displayName', '', 'displayName', '', 'LDAP鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (102, 1, '', '1', 'employeeNumber', '', 'employeeNumber', '', 'LDAP鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (103, 1, '', '1', 'jobTitle', '', 'title', '', 'LDAP鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (104, 1, '', '1', 'workOfficeName', '', 'physicalDeliveryOfficeName', '', 'LDAP鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (105, 1, '', '1', 'workEmail', '', 'mail', '', 'LDAP鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (106, 1, '', '1', 'workRegion', '', 'st', '', 'LDAP鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (107, 1, '', '1', 'workLocality', '', 'l', '', 'LDAP鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (108, 1, '', '1', 'workStreetAddress', '', 'street', '', 'LDAP鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (109, 1, '', '1', 'workPostalCode', '', 'postalCode', '', 'LDAP鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (110, 1, '', '1', 'workAddressFormatted', '', 'postOfficeBox', '', 'LDAP鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (111, 1, '', '1', 'workFax', '', 'facsimileTelephoneNumber', '', 'LDAP鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (112, 1, '', '1', 'homePhoneNumber', '', 'homePhone', '', 'LDAP鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (113, 1, '', '1', 'homeAddressFormatted', '', 'homePostalAddress', '', 'LDAP鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (114, 1, '', '1', 'mobile', '', 'mobile', '', 'LDAP鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (115, 1, '', '1', 'preferredLanguage', '', 'preferredLanguage', '', 'LDAP鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (116, 1, '', '1', 'description', '', 'description', '', 'LDAP鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (117, 1, '', '2', 'orgCode', '', 'id', '', 'LDAP缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (118, 1, '', '2', 'orgName', '', 'ou', '', 'LDAP缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (119, 1, '', '2', 'fullName', '', 'orgName', '', 'LDAP缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (120, 1, '', '2', 'region', '', 'st', '', 'LDAP缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (121, 1, '', '2', 'locality', '', 'l', '', 'LDAP缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (122, 1, '', '2', 'street', '', 'street', '', 'LDAP缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (123, 1, '', '2', 'postalCode', '', 'postalCode', '', 'LDAP缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (124, 1, '', '2', 'address', '', 'postalAddress', '', 'LDAP缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (125, 1, '', '2', 'phone', '', 'telephoneNumber', '', 'LDAP缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (126, 1, '', '2', 'fax', '', 'facsimileTelephoneNumber', '', 'LDAP缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (127, 1, '', '2', 'description', '', 'description', '', 'LDAP缁勭粐', 0, NULL, 0, '2024-09-24 04:12:57');
INSERT INTO `sync_job_config_field` VALUES (128, 7, '', '1', 'id', '', 'id', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (129, 7, '', '1', 'username', '', 'username', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (130, 7, '', '1', 'picture', '', 'picture', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (131, 7, '', '1', 'displayName', '', 'displayname', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (132, 7, '', '1', 'nickName', '', 'nickname', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (133, 7, '', '1', 'mobile', '', 'mobile', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (134, 7, '', '1', 'email', '', 'email', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (135, 7, '', '1', 'birthDate', '', 'birthdate', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (136, 7, '', '1', 'userType', '', 'usertype', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (137, 7, '', '1', 'userState', '', 'userstate', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (138, 7, '', '1', 'windowsAccount', '', 'windowsaccount', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (139, 7, '', '1', 'givenName', '', 'givenname', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (140, 7, '', '1', 'middleName', '', 'middlename', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (141, 7, '', '1', 'married', '', 'married', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (142, 7, '', '1', 'gender', '', 'gender', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (143, 7, '', '1', 'idType', '', 'idtype', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (144, 7, '', '1', 'idCardNo', '', 'idcardno', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (145, 7, '', '1', 'webSite', '', 'website', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (146, 7, '', '1', 'startWorkDate', '', 'startworkdate', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (147, 7, '', '1', 'workCountry', '', 'workcountry', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (148, 7, '', '1', 'workRegion', '', 'workregion', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (149, 7, '', '1', 'workLocality', '', 'worklocality', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (150, 7, '', '1', 'workStreetAddress', '', 'workstreetaddress', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (151, 7, '', '1', 'workAddressFormatted', '', 'workaddressformatted', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (152, 7, '', '1', 'workEmail', '', 'workemail', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (153, 7, '', '1', 'workPhoneNumber', '', 'workphonenumber', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (154, 7, '', '1', 'workPostalCode', '', 'workpostalcode', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (155, 7, '', '1', 'workFax', '', 'workfax', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (156, 7, '', '1', 'workOfficeName', '', 'workofficename', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (157, 7, '', '1', 'homeCountry', '', 'homecountry', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (158, 7, '', '1', 'homeRegion', '', 'homeregion', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (159, 7, '', '1', 'homeLocality', '', 'homelocality', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (160, 7, '', '1', 'homeStreetAddress', '', 'homestreetaddress', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (161, 7, '', '1', 'homeAddressFormatted', '', 'homeaddressformatted', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (162, 7, '', '1', 'homeEmail', '', 'homeemail', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (163, 7, '', '1', 'homePhoneNumber', '', 'homephonenumber', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (164, 7, '', '1', 'homePostalCode', '', 'homepostalcode', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (165, 7, '', '1', 'homeFax', '', 'homefax', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (166, 7, '', '1', 'employeeNumber', '', 'employeenumber', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (167, 7, '', '1', 'costCenter', '', 'costcenter', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (168, 7, '', '1', 'organization', '', 'organization', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (169, 7, '', '1', 'division', '', 'division', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (170, 7, '', '1', 'departmentId', '', 'departmentid', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (171, 7, '', '1', 'department', '', 'department', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (172, 7, '', '1', 'jobTitle', '', 'jobtitle', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (173, 7, '', '1', 'jobLevel', '', 'joblevel', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (174, 7, '', '1', 'managerId', '', 'managerid', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (175, 7, '', '1', 'manager', '', 'manager', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (176, 7, '', '1', 'assistantId', '', 'assistantid', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (177, 7, '', '1', 'assistant', '', 'assistant', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (178, 7, '', '1', 'entryDate', '', 'entrydate', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (179, 7, '', '1', 'quitDate', '', 'quitdate', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (180, 7, '', '1', 'ldapDn', '', 'ldapdn', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (181, 7, '', '1', 'description', '', 'description', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (182, 7, '', '1', 'status', '', 'status', '', 'jdbc鐢ㄦ埛', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (183, 7, '', '2', 'id', '', 'id', '', 'jdbc缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (184, 7, '', '2', 'orgCode', '', 'orgcode', '', 'jdbc缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (185, 7, '', '2', 'orgName', '', 'orgname', '', 'jdbc缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (186, 7, '', '2', 'fullName', '', 'fullname', '', 'jdbc缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (187, 7, '', '2', 'parentId', '', 'parentid', '', 'jdbc缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (188, 7, '', '2', 'parentCode', '', 'parentcode', '', 'jdbc缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (189, 7, '', '2', 'type', '', 'type', '', 'jdbc缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (190, 7, '', '2', 'codePath', '', 'codepath', '', 'jdbc缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (191, 7, '', '2', 'namePath', '', 'namepath', '', 'jdbc缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (192, 7, '', '2', 'level', '', 'level', '', 'jdbc缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (193, 7, '', '2', 'hasChild', '', 'haschild', '', 'jdbc缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (194, 7, '', '2', 'division', '', 'division', '', 'jdbc缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (195, 7, '', '2', 'country', '', 'country', '', 'jdbc缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (196, 7, '', '2', 'region', '', 'region', '', 'jdbc缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (197, 7, '', '2', 'locality', '', 'locality', '', 'jdbc缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (198, 7, '', '2', 'street', '', 'street', '', 'jdbc缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (199, 7, '', '2', 'address', '', 'address', '', 'jdbc缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (200, 7, '', '2', 'contact', '', 'contact', '', 'jdbc缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (201, 7, '', '2', 'postalCode', '', 'postalcode', '', 'jdbc缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (202, 7, '', '2', 'phone', '', 'phone', '', 'jdbc缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (203, 7, '', '2', 'fax', '', 'fax', '', 'jdbc缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (204, 7, '', '2', 'email', '', 'email', '', 'jdbc缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (205, 7, '', '2', 'sortIndex', '', 'sortindex', '', 'jdbc缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (206, 7, '', '2', 'ldapDn', '', 'ldapdn', '', 'jdbc缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (207, 7, '', '2', 'description', '', 'description', '', 'jdbc缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (208, 7, '', '2', 'status', '', 'status', '', 'jdbc缁勭粐', 0, NULL, 0, NULL);
INSERT INTO `sync_job_config_field` VALUES (209, 6, '', '1', 'departmentId', '', 'objectId', '', '椋炰功鐢ㄦ埛', 0, NULL, 0, NULL);

SET FOREIGN_KEY_CHECKS = 1;

