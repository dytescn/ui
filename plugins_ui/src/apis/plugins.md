// Plugins 本地插件（扩展后）
type Plugins struct {
    UUID        string         `json:"uuid" gorm:"column:uuid;primaryKey;comment:'插件编号'"`
    OUID        string         `json:"ouid" gorm:"column:ouid;index;comment:'组织编号'"`
    FlowUID     string         `json:"flow_uid" gorm:"column:flow_uid;index;comment:'流程编号'"`
    TypeUID     string         `json:"type_uid" gorm:"column:type_uid;index;comment:'插件类型（旧版）'"`
    CategoryID  string         `json:"category_id" gorm:"column:category_id;index;comment:'新分类ID（关联PluginCategory）'"`
    Name        string         `json:"name" gorm:"column:name;index;comment:'插件名称'"`
    Desc        string         `json:"desc" gorm:"column:desc;type:text;comment:'插件详情'"`
    CreateBy    string         `json:"create_by" gorm:"column:create_by;comment:'创建人'"`
    Cover       string         `json:"cover" gorm:"column:cover;comment:'封面图URL'"`
    Status      string         `json:"status" gorm:"column:status;default:'draft';index;comment:'draft|review|published|offline|deprecated'"`
    Public      bool           `json:"public" gorm:"column:public;default:false;comment:'是否公开'"`
    UpdatedBy   string         `json:"updated_by" gorm:"column:updated_by;comment:'最后修改人UID'"`
    gorm.Model                 // ID, CreatedAt, UpdatedAt, DeletedAt
}

// PluginCategory 插件分类（原 PluginType 升级）
type PluginCategory struct {
    UUID       string         `json:"uuid" gorm:"column:uuid;primaryKey;comment:'分类编号'"`
    TypeName   string         `json:"type_name" gorm:"column:type_name;uniqueIndex;comment:'分类名称'"`
    Icon       string         `json:"icon" gorm:"column:icon;comment:'图标标识'"`
    ParentUUID string         `json:"parent_uuid" gorm:"column:parent_uuid;index;comment:'父分类UUID（支持多级）'"`
    SortOrder  int            `json:"sort_order" gorm:"column:sort_order;default:0"`
    CreatedBy  string         `json:"created_by" gorm:"column:created_by"`
    UpdatedBy  string         `json:"updated_by" gorm:"column:updated_by"`
}

// PluginVersion 插件版本
type PluginVersion struct {
    ID           uint           `gorm:"primaryKey"`
    PluginUUID   string         `gorm:"column:plugin_uuid;index;comment:'关联插件UUID'"`
    Version      string         `gorm:"column:version;comment:'语义化版本号'"`
    Changelog    string         `gorm:"column:changelog;type:text;comment:'更新日志'"`
    FilePath     string         `gorm:"column:file_path;comment:'文件存储路径'"`
    FileSize     int64          `gorm:"column:file_size;comment:'文件大小（字节）'"`
    FileHash     string         `gorm:"column:file_hash;comment:'文件SHA256校验值'"`
    FileType     string         `gorm:"column:file_type;default:'zip';comment:'包类型'"`
    MinEngineVer string         `gorm:"column:min_engine_ver;comment:'最低引擎版本'"`
    MaxEngineVer string         `gorm:"column:max_engine_ver;comment:'最高引擎版本'"`
    Status       string         `gorm:"column:status;default:'active';comment:'版本状态'"`
    IsLatest     bool           `gorm:"column:is_latest;default:false;index;comment:'是否为最新推荐版本'"`
    CreatedBy    string         `gorm:"column:created_by;comment:'发布者UID'"`
    CreatedAt    time.Time
    UpdatedAt    time.Time
    DeletedAt    gorm.DeletedAt `gorm:"index"`
}

// PluginConfig 插件配置参数
type PluginConfig struct {
    ID           uint   `gorm:"primaryKey"`
    PluginUUID   string `gorm:"column:plugin_uuid;index;comment:'插件UUID'"`
    VersionID    uint   `gorm:"column:version_id;index;comment:'关联版本ID（0表示通用配置）'"`
    ParamKey     string `gorm:"column:param_key;comment:'参数键'"`
    ParamType    string `gorm:"column:param_type;comment:'类型：string/int/bool/select'"`
    DefaultValue string `gorm:"column:default_value;comment:'默认值'"`
    Required     bool   `gorm:"column:required;default:false;comment:'是否必填'"`
    Description  string `gorm:"column:description;comment:'参数说明'"`
    Options      string `gorm:"column:options;type:text;comment:'可选值列表（JSON数组）'"`
    SortOrder    int    `gorm:"column:sort_order;default:0"`
}