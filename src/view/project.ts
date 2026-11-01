export const project_card_tpl = `
  <% it.projects.forEach(function(rowitem){ %>
        <a class="vg-cards cards-content-img" href="/workspace?uuid=<%= rowitem.uuid || '' %>">
        <div class="cards-images-container">
            <div class="cards-img-images" style="background-image: url('<%= rowitem.cover || '/assets/imgs/default-cover.png' %>');"></div>
        </div>
        <p class="cards-img-tip vg-avatar-bg avatar-size-sm not-bg" 
            style="background-image: url('https://book.funxdata.com/public/img/webmanage/AI.png');">
        </p>
        <div class="cards-img-name">
            <p class="name mb-2"><%= rowitem.name || '未命名' %></p>
            <p class="span">更新于：<span><%= rowitem.updated_at ? new Date(rowitem.updated_at).toLocaleString() : '' %></span></p>
        </div>
        </a>
    <% }) %>
`;
