export const workspace_design_card_tpl = `
<% it.designfiles.forEach(function(rowitem){ %>
    <div class="vg-cards cards-content-img">
        <div class="cards-img-images" style="background-image: url('http://127.0.0.1:44944/assets/<%= rowitem.cover || 'default-cover.png' %>');">
            <div class="applogo vg-avatar-bg avatar-size-sm not-bg">
                <%~ rowitem.icon_svg %>
            </div>
        </div>
        <div class="cards-img-name">
            <p class="name"><%= rowitem.name %></p>
            <p class="span">更新于：<span><%= rowitem.updated_at_display %></span></p>
        </div>
        <div class="link-button card-hover-buttons row align-center justify-center w-auto">
            <div class="row rowcolumn w-auto h-auto gap-12">
                <button class="vg-btn btn-type-info" fxtag="viewImage">编辑文件</button>
                <button class="vg-btn btn-type-info" fxtag="viewSteps">查看版本</button>
            </div>
        </div>
    </div>
<% }) %>
`;