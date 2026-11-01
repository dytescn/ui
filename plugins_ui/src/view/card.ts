export const card_tpl = `
<% it.lists.forEach(function(row){ %>
    <div class="cards-content-material" data-uuid="<%= row.uuid %>" style="position:relative">
        <button class="vg-btn plugin-settings" data-uuid="<%= row.uuid %>" data-action="settings"
            style="position:absolute;top:8px;right:8px;z-index:2">设置</button>
        <p class="images">
            <img class="images-folder" fxtag="imageUrl">
        </p>
        <p class="names"><%= row.name %></p>
        <% if (row.needs_update) { %>
            <p class="plugin-update-tag" style="color:#d97706;font-size:12px">可更新 → <%= row.remote_version %></p>
        <% } %>
        <div class="tips">
            <div class="row align-center justify-between">
                <% if (row.installed) { %>
                    <button class="vg-btn deletetxt plugin-action" data-uuid="<%= row.uuid %>" data-action="uninstall">卸载</button>
                <% } else { %>
                    <button class="vg-btn plugin-action" data-uuid="<%= row.uuid %>" data-action="install">安装</button>
                <% } %>
                <div class="vg-avatar-bg avatar-size-24 ml-auto" fxtag="fileTypeUrl" style="background-image: url('<%= row.uuid %>');"></div>
            </div>
        </div>
    </div>
<% }) %>
`;
