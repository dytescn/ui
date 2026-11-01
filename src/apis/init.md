// routers 路由表
type FileDisk routers (
    id INTEGER PRIMARY KEY,
    title TEXT,
    icon TEXT,
    hide INTEGER,
    path TEXT,
    child TEXT,
    url TEXT,
    show INTEGER,
    parent_id INTEGER,
    level INTEGER
);

// file 文件相关
type FileDisk struct {
	UUID          string `json:"uuid" gorm:"column:uuid;comment:'文件编号'"`
	OUID          string `json:"ouid" gorm:"column:ouid;comment:'企业编号'"`
	StorageVendor string `json:"storage_vendor" gorm:"column:storage_vendor;comment:'存储供应商'"` // cdn
	Fuid          string `json:"fuid" gorm:"column:fuid;comment:'文件归属文件夹'"`
	PathName      string `json:"path_name" gorm:"column:path_name;comment:'目录地址'"`
	Title         string `json:"title" gorm:"column:title;comment:'文件名称'"`
	Extension     string `json:"extension" gorm:"column:extension;comment:'加强'"`
	Size          int64  `json:"size" gorm:"column:size;comment:'尺寸'"`
	CreateByUID   string `json:"create_by" gorm:"column:create_by;comment:'创建者'"`
	Downloads     int    `json:"downloads" gorm:"column:downloads;default:0;comment:'下载次数'"`
	Extra         string `json:"extra" gorm:"column:extra;comment:'后缀名'"`
	FileGroup     string `json:"file_group" gorm:"column:file_group;comment:'文件大分组'"`
	FileType      string `json:"file_type" gorm:"column:file_type;comment:'文件类型'"`
	StoreBuket    string `json:"store_buket" gorm:"column:store_buket;comment:'存储区域'"`
	StoreUrl      string `json:"store_url" gorm:"column:store_url;comment:'文件名'"`
	FileHash      string `json:"file_hash" gorm:"column:file_hash;comment:'文件hash值'"`
	SliceSum      int    `json:"slice_sum" gorm:"column:slice_sum;comment:'文件切片数'"`
	Cover         string `json:"cover" gorm:"column:cover;comment:'封面图'"`
	IsLarge       int    `json:"is_large" gorm:"column:is_large;comment:'是否是大文件'"`
}