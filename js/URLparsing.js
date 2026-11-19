const defaultTitle = "WENIVLOG";
const url = new URL(window.location.href);
const origin = url.origin + url.pathname.replace(/index\.html$/, "");
const pathParts = url.pathname.split("/").filter((part) => part.length > 0);
const isLocal = url.hostname === "127.0.0.1" || url.hostname === "localhost";

if (window.location.pathname.endsWith("/index.html")) {
  pathParts.pop();
  const newPath = window.location.pathname.replace(/index\.html$/, "");
  history.replaceState(null, "", newPath);
}

function bindBlogTitleNavigation() {
  const blogTitle = document.getElementById("blog-title");
  blogTitle.innerText = siteConfig.blogTitle || defaultTitle;
  document.title = siteConfig.blogTitle || defaultTitle;

  const homeLink = document.getElementById("blog-home-link");
  homeLink.href = origin;
  homeLink.onclick = (event) => {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    window.history.pushState({}, "", origin);
    renderBlogList();
    window.scrollTo(0, 0);
  };
}

bindBlogTitleNavigation();

window.addEventListener("popstate", (event) => {
  const currentUrl = new URL(window.location.href);
  const postName = currentUrl.searchParams.get("post");
  const menuName = currentUrl.searchParams.get("menu");

  if (postName) {
    renderPostByName(postName, false);
    return;
  }

  if (menuName && menuName !== "blog.md") {
    renderOtherContents(menuName);
    return;
  }

  const view = event.state?.blogListView;
  const category = currentUrl.searchParams.get("category");
  if (!view && category) {
    search(category, "category");
    return;
  }
  const names = view?.postNames ? new Set(view.postNames) : null;
  renderBlogList(names ? blogList.filter((post) => names.has(post.name)) : null,
    view?.currentPage || 1);
});
