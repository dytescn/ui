// src/view/card.ts
export const card_tpl = `
<% it.lists.forEach(function(row){ %>
<div class="cards-content-material" data-id="<%= row.id %>" data-uuid="<%= row.uuid %>">
  <p class="images">
    <img class="images-folder" src="<%= row.cover || '/assets/imgs/default-cover.png' %>" alt="<%= row.name %>">
  </p>
  <p class="names"><%= row.name %></p>
  <div class="tips">
    <div class="row align-center justify-end">
      <div class="toolicons">
        <i class="vg-icon ic-dots"></i>
        <div class="vg-dropdowns">
          <ul class="vg-dropdowns-content">
            <li class="vg-dropdowns-li" data-action="rename">重命名</li>
            <li class="vg-dropdowns-li deletetxt" data-action="delete">删除</li>
          </ul>
        </div>
      </div>
      <div class="vg-avatar-bg avatar-size-24 ml-auto" style="background-image: url('<%= row.type_icon %>');"></div>
    </div>
  </div>
</div>
<% }) %>
`;