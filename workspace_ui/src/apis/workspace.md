1. 项目表 projects
字段名	类型	约束	说明
uuid	TEXT	PRIMARY KEY	项目编号
organ_uid	TEXT	INDEX	所属组织 UID
create_by	TEXT	INDEX	项目创建人
pro_tpl_uid	TEXT	INDEX	项目模板 UID
cover	TEXT		封面图片地址
name	TEXT		项目名称
description	TEXT		项目描述
sort	INTEGER		排序值
schedule	TEXT		进度信息
is_private	INTEGER	DEFAULT 0	是否私有（0/1）
is_archived	INTEGER	DEFAULT 0	是否归档（0/1）
archive_time	DATETIME	NULL	归档时间
open_begin_time	DATETIME	NULL	任务开始时间（若启用）
open_task_private	INTEGER	DEFAULT 0	新任务默认开启隐私模式（0/1）
begin_time	DATETIME	NULL	项目开始日期
end_time	DATETIME	NULL	项目截止日期
recycle_time	DATETIME	NULL	回收时间
is_recycled	INTEGER	DEFAULT 0	是否已回收（0/1）
auto_update_schedule	INTEGER	DEFAULT 0	自动更新项目进度（0/1）
created_at	DATETIME	NOT NULL	创建时间
updated_at	DATETIME	NOT NULL	更新时间
deleted_at	DATETIME	INDEX	软删除时间（用于回收站）
备注：is_follow 字段为运行时计算，不持久化。

2. 项目更新记录表 project_features
字段名	类型	约束	说明
uuid	TEXT	PRIMARY KEY	记录编号
project_uid	TEXT	INDEX	所属项目编号
name	TEXT		名称
description	TEXT		描述
created_at	DATETIME	NOT NULL	创建时间
updated_at	DATETIME	NOT NULL	更新时间
3. 项目版本表 project_versions
字段名	类型	约束	说明
uuid	TEXT	PRIMARY KEY	版本编号
project_uid	TEXT	INDEX	所属项目编号
name	TEXT		版本名称
description	TEXT		版本描述
start_time	DATETIME	NULL	开始时间
publish_time	DATETIME	NULL	实际发布时间
plan_publish_time	DATETIME	NULL	计划发布时间
schedule	INTEGER		进度百分比（0-100）
status	INTEGER		状态：0未开始，2延期，3已发布
features_uid	TEXT	INDEX	关联的版本库编号
created_at	DATETIME	NOT NULL	创建时间
updated_at	DATETIME	NOT NULL	更新时间
4. 项目版本日志表 project_version_logs
字段名	类型	约束	说明
uuid	TEXT	PRIMARY KEY	日志编号
staff_uid	TEXT	INDEX	操作员工 UID
content	TEXT		操作内容描述
remark	TEXT		日志备注
log_type	TEXT		操作类型
task_uid	TEXT	INDEX	关联任务 UID
project_uid	TEXT	INDEX	关联项目编号
features_uid	TEXT	INDEX	关联版本库编号
created_at	DATETIME	NOT NULL	创建时间
5. 项目日志表 project_logs
字段名	类型	约束	说明
uuid	TEXT	PRIMARY KEY	日志编号
project_uid	TEXT	INDEX	关联项目编号
task_uid	TEXT	INDEX	关联任务 UID
staff_uid	TEXT	INDEX	操作员工 UID
content	TEXT		操作内容
remark	TEXT		备注
log_type	TEXT		日志类型
action_type	TEXT		场景类型
to_staff_uid	TEXT	INDEX	目标员工 UID
is_comment	INTEGER	DEFAULT 0	是否为评论（0/1）
created_at	DATETIME	NOT NULL	创建时间
6. 设计文件表 design_files
字段名	类型	约束	说明
uuid	TEXT	PRIMARY KEY	文件编号
project_uid	TEXT	INDEX	所属项目编号
organ_uid	TEXT	INDEX	所属组织编号
flow_uid	TEXT	INDEX	关联流程编号
type_uid	TEXT	INDEX	文件类型编号
name	TEXT		文件名称
description	TEXT		文件描述
create_by	TEXT	INDEX	创建人
cover	TEXT		封面图地址
created_at	DATETIME	NOT NULL	创建时间
updated_at	DATETIME	NOT NULL	更新时间
7. 设计文件类型表 design_types
字段名	类型	约束	说明
uuid	TEXT	PRIMARY KEY	类型编号
type_name	TEXT		类型名称
icon	TEXT		类型图标
extra	TEXT		文件后缀名
created_at	DATETIME	NOT NULL	创建时间
updated_at	DATETIME	NOT NULL	更新时间
8. 设计文件版本表 design_versions
字段名	类型	约束	说明
uuid	TEXT	PRIMARY KEY	版本编号
cover	TEXT		封面图地址
design_uid	TEXT	INDEX	关联的设计文件编号
child_uid	TEXT	INDEX	关联的节点编号
soft_ver	TEXT		软件版本号
name	TEXT		版本名称
logs	TEXT		版本描述
fuid	TEXT	INDEX	关联的文件存储编号
create_by	TEXT	INDEX	创建人
created_at	DATETIME	NOT NULL	创建时间
updated_at	DATETIME	NOT NULL	更新时间