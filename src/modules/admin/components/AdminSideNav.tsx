import { Link } from "react-router-dom";

import { ADMIN_SIDE_MENU_MAP } from "@/modules/admin/constants/adminSideNavConstants";
import type { SideMenuCategory, SideMenuItem } from "@/modules/admin/constants/adminSideNavConstants";

type AdminSideNavProps = {
    categoryStatus: SideMenuCategory;
}

function AdminSideNav(props: AdminSideNavProps) {
    const { categoryStatus } = props;

	return (
		<div className="side-nav">
			<ul className="side-nav-ul">
				{ADMIN_SIDE_MENU_MAP.map((menu) => (
					<li key={menu.key}>
						<Link to={menu.link}>{menu.label}</Link>
						{menu.hasSubmenu && (
							<SideMenuCategory categoryStatus={categoryStatus} status={menu.key} submenu={menu.submenu}/>
						)}
					</li>
				))}
			</ul>
		</div>
	)
}

type SideMenuCategoryProps = {
    categoryStatus: SideMenuCategory;
    status: SideMenuCategory;
	submenu: SideMenuItem[];
}

function SideMenuCategory(props: SideMenuCategoryProps) {
    const { categoryStatus, status, submenu } = props;

    if(categoryStatus !== status)
        return null;

    return (
        <ul className="admin-side-nav-category-ul">
            {submenu.map((item, index) => (
				<li key={`${item.link}-${index}`}>
					<Link to={item.link}>{item.text}</Link>
				</li>
			))}
        </ul>
    )
}
export default AdminSideNav;