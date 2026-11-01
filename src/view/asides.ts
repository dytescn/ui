export const asides_tpl = `
   <div class="rowcolumn">
      <a class="vg-asides-logo" href="/"><img src="https://uicdn.funxdata.com/assets/logo_piksel.png"></a>
      <div class="vg-asides-menus hover flex-auto mb-24 position-relative">
          <div class="vg-asides-menus-content">
            <ul class="vg-menus" id="aside_tab">
              <% it.asides.forEach(function(rowitem){ %>
              <li class="vg-menus-li" id="aside_tab_project">
                <a href="<%=rowitem.path%>">
                <div class="menus-bars">
                  <button><i class="vg-icon <%=rowitem.icon %>"></i></button>
                  <p class="font-size-11 color-gray-500 align-center"><%=rowitem.title%></p>
                </div>
                </a>
              </li>
              <% }) %>
           </ul>
          </div>
       </div>


      <div id="all-setting-info" class="row rowcolumn align-center h-auto mb-20 gap-16" data-toggle="hide">
        <buttom id="design-soft-info" class="vg-avatar-bg avatar-size-lg border-radius-max cursor-pointer"></buttom>
      </div>
    </div>
`;
