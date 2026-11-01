export const workspace_setting_tpl = `
<ul class="pages-personal">
	<li class="pages-personal-li row" id="setup_name">
		<div class="flex-auto">
			<p class="text font-size-14 color-gray-900">项目名称</p>
			<p class="span mt-4 font-size-12 color-gray-500" id="name_text"><%= it.projectinfo.name %></p>
		</div>
		<button class="vg-btn btn-size-md" id="setup_name_edit">编辑名称</button>
	</li>
	<li class="pages-personal-li row" id="setup_avator">
		<div class="vg-avatar-bg avatar-size-lg mr-8 border-radius-max" id="avator_img"></div>
		<div class="flex-auto">
			<p class="text font-size-14 color-gray-900">项目封面</p>
			<p class="span mt-4 font-size-12 color-gray-500">支持 2M 以内的 JPG PNG 图片格式</p>
		</div>
		<button class="vg-btn btn-size-md" id="avator_edit">上传封面</button>
		<input type="file" id="avator_input" accept=".jpeg,.jpg,.png" style="display: none" />
	</li>
	<li class="pages-personal-li row" id="setup_description">
		<div class="flex-auto">
			<p class="text font-size-14 color-gray-900">项目简介</p>
			<p class="span mt-4 font-size-12 color-gray-500" id="description_text"><%= it.projectinfo.description || '暂无填写项目简介' %></p>
		</div>
		<button class="vg-btn btn-size-md" id="description_edit">编辑信息</button>
	</li>
	<li class="pages-personal-li row" id="setup_filing">
		<div class="flex-auto">
			<p class="text font-size-14 color-gray-900">项目归档</p>
			<p class="span mt-4 font-size-12 color-gray-500" fxtag="text">注：项目未完成前，请不要归档！</p>
		</div>
		<button class="vg-btn btn-size-md" id="filing_btn">归档项目</button>
	</li>
	<li class="pages-personal-li row" id="setup_del">
		<div class="flex-auto">
			<p class="text font-size-14 color-gray-900">删除项目</p>
			<p class="span mt-4 font-size-12 color-gray-500">删除项目后，项目文件将永久删除，所有成员将无法访问项目文件。</p>
		</div>
		<button class="vg-btn btn-size-md btn-type-error" id="del_btn">删除项目</button>
	</li>
</ul>
`;