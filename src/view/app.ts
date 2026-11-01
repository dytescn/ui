// src/view/app.ts
export const app_tpl = `
<div class="pages-manage-material row rowcolumn flex1">
    <div class="prow-16 pcol-20 color-gray-800 h-60">
        <h5 class="h5 font-weight-lg">素材管理</h5>
    </div>
    <div class="vg-card-tables row rowcolumn flex1 bg-gray-50 p-10 gap-10">
        <div class="manage-setting-content row rowcolumn flex1 bg-white p-20 border-radius-lg">
            <div class="webmanage-project-material h-100% row rowcolumn gap-20 flex1">
                <div class="webmanage-project-tips row align-center h-auto">
                    <div class="flex1 row align-center gap-12" id="tags-list">
                    </div>
                    <div class="row align-center w-auto gap-12">
                    </div>
                </div>
                <div  id="all-cards-content" class="project-material-contents overflow-y set-scrollbar"></div>
            </div>
        </div>
    </div>
</div>
`;