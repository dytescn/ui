// 素材文件
type MaterialFile struct {
	UUID     string `json:"uuid" gorm:"column:uuid;comment:'参数编号'"`
	PUID     string `json:"puid" gorm:"column:puid;comment:'项目编号'"`
	OUID     string `json:"ouid" gorm:"column:ouid;comment:'组织编号'"`
	FlowUID  string `json:"flow_uid" gorm:"column:flow_uid;comment:'流程编号'"`
	TypeUID  string `json:"type_uid" gorm:"column:type_uid;comment:'项目编号'"`
	Name     string `json:"name" gorm:"column:name;comment:'网页文件'"`
	Desc     string `json:"desc" gorm:"column:desc;comment:'网页文件描述'"`
	CreateBy string `json:"create_by" gorm:"column:create_by;comment:'创建人'"`
	Cover    string `json:"cover" gorm:"column:cover;comment:'封面图'"`
	gorm.Model
}

// 素材类型
type MaterialType struct {
	UUID     string `json:"uuid" gorm:"column:uuid;comment:'类型编号'"`
	TypeName string `json:"type_name" gorm:"column:type_name;comment:'类型名称'"`
	Icon     string `json:"icon" gorm:"column:icon;comment:'类型名称'"`
	gorm.Model
}

// 素材版本
type MaterialVersion struct {
	UUID     string `json:"uuid" gorm:"column:uuid;comment:'类型编号'"`
	Cover    string `json:"cover" gorm:"column:cover;comment:'封面图'"`
	MaterialUID  string `json:"page_uid" gorm:"column:page_uid;comment:'网页id'"`
	ChildUID string `json:"child_uid" gorm:"column:child_uid;comment:'节点id'"`
	SoftVer  string `json:"soft_ver" gorm:"column:soft_ver;comment:'软件版本'"`
	Name     string `json:"name" gorm:"column:name;comment:'版本名称'"`
	Logs     string `json:"logs" gorm:"column:logs;comment:'版本描述'"`
	FUID     string `json:"fuid" gorm:"column:fuid;comment:'文件编号'"`
	CreateBy string `json:"create_by" gorm:"column:create_by;comment:'创建人'"`
	gorm.Model
}