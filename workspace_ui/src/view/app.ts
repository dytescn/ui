export const project_tpl = `
<div class="vg-mains flex1 row" id="main">
   <div class="pages-project-myproject row rowcolumn flex1">
       <div class="row align-center prow-16 pcol-20 color-gray-800 h-60">
           <h5 class="h5 flex1 font-weight-lg text-left">所有项目</h5>
              <div class="row align-center w-auto gap-12">
                  <div class="vg-searchs searchs-size-sm">
                     <div class="search-icons">
                       <i class="vg-icon ic-search"></i>
                     </div>
                     <input placeholder="搜索项目" id="search_manage">
                  </div>
                  <div class="vg-dropdowns-title">
                      <button class="vg-btn btn-block btn-size-sm" id="filter_archived">
                        <p class="mr-4 flex1 text-overflow">已归档</p>
                      </button>
                  </div>
                 </div>
                 <div class="vg-paginations" id="member_pagination"></div>
               </div>
               <div class="vg-card-tables row rowcolumn flex1 bg-gray-50 gap-10">
                 <div class="pages-project-module row rowcolumn flex1 bg-white pcol-16 pb-16 border-radius-lg">
                   <div class="pages-project-body row rowcolumn flex1" id="project_all">
                      <div class="pages-project-addproject vg-card" id="add_project">
                      <div class="addproject-container">
                      <i class="vg-icon ic-plus"></i>
                      <p class="text mt-8">创建项目</p>
                      </div>
                    </div>
                </div>
           </div>
      </div>
  </div>
</div>
`;

export const workspace_tpl = `
   <div class="flex-auto row rowcolumn flex1">
    <div class="prow-16 pcol-20 color-gray-800 h-60">
        <h5 class="h5 font-weight-lg"><%= it.project.name %></h5>
    </div>
    <div class="vg-card-tables row rowcolumn flex1 bg-gray-50 p-10 gap-10">
        <div class="bg-white prow-8 pcol-20 border-radius-lg">
            <ul class="vg-tabs" fxtag="project_tab">
               <li class="vg-tabs-li <%= it.active === 'list' ? 'select' : '' %>">
                   <% if (it.active === 'list') { %>
                       <a>文件</a>
                   <% } else { %>
                       <a href="/workspace?puid=<%= it.project.uuid %>">文件</a>
                   <% } %>
               </li>
               <li class="vg-tabs-li <%= it.active === 'setting' ? 'select' : '' %>">
                   <% if (it.active === 'setting') { %>
                       <a>设置</a>
                   <% } else { %>
                       <a href="/workspace/setting?puid=<%= it.project.uuid %>">设置</a>
                   <% } %>
               </li>
            </ul>   
         </div>
        <div class="manage-setting-content row rowcolumn flex1 bg-white p-20 border-radius-lg" id="project_content">
        <div class="webmanage-project-files h-100% row rowcolumn gap-20 flex1">
            <div class="row rowcolumn flex1">
               <div class="webmanage-project-tips row">
                     <div class="flex-auto">
                        <ul class="vg-breadcrumbs" fxtag="file_bar"></ul>
                     </div>
                     <div class="right-buttonsall">
                        <button id="design_file_add" class="vg-btn btn-icons btn-size-xl">
                           <i class="vg-icon ic-plus"></i>
                        </button>
                     </div>
               </div>
               <div id="design-files" class="pages-project-body overflow-y set-scrollbar" ></div>
            </div>
         </div>
		</div>
    </div>
</div>
`;
