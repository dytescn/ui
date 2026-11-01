export const design_choose_tpl = `
  <div class="vg-dropdowns-content" style="width:315px;position: absolute;inset: auto auto 20px 44px;">
    <div class="dropdowns-modules border">
      <% it.designsofts.forEach(function(rowitem){ %>
          <a class="dropdowns-modules-items design-soft-item" 
             data-name="<%=rowitem.name%>" 
             data-version="<%=rowitem.version%>">
              <p class="txticons vg-avatar-bg avatar-size-xs not-bg mr-8">
                  <i class="vg-icon"><%~ rowitem.icon %></i>
              </p>
              <p class="txtvalue"><%=rowitem.name %></p>
          </a>
      <% }) %>
    </div>
    <div class="dropdowns-modules border">
      <a class="dropdowns-modules-items" href="/designsoft">
         <p class="txticons vg-avatar-bg avatar-size-xs not-bg mr-8 color-error"></p>
         <p class="txtvalue color-error">设置设计软件</p>
      </a>
    </div>
  </div>
`;


export const designsoft_tpl = `
<li class="pages-personal-li row">
    <div class="flex-auto">
        <input type="text" id="design_keyword" placeholder="输入软件关键字，如 Illustrator" class="vg-input" style="width:100%;" />
    </div>
    <button class="vg-btn btn-size-md" id="check_design_soft">检测</button>
</li>

<!-- 软件列表项 -->
<% it.designsofts.forEach(function(rowitem){ %>
<li class="pages-personal-li row" id="profile_description">
    <div class="flex-auto">
        <p class="text font-size-14 color-gray-900">
               <span style="display:inline-block; width:20px; height:20px; vertical-align:middle; margin-right:4px;">
        <%~ rowitem.icon %>
    </span> <%= rowitem.name %>
        </p>
        <p class="span mt-4 font-size-12 color-gray-500">
            版本: <%= rowitem.version %> | 路径: <%= rowitem.install_path || '未记录' %>
        </p>
    </div>
    <button class="vg-btn btn-size-md btn-delete-software" data-id="<%= rowitem.id %>">删除</button>
</li>
<% }) %>
`;