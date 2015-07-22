package org.activiti.explorer.filter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

public class ExplorerFilterEx implements Filter {

	private List<String> ignoreList = new ArrayList<String>();

	public void init(FilterConfig filterConfig) throws ServletException {
		ignoreList.add("/ui");
		ignoreList.add("/VAADIN");
		ignoreList.add("/api");
		ignoreList.add("/editor");
		ignoreList.add("/explorer");
		ignoreList.add("/libs");
		ignoreList.add("/service");
		ignoreList.add("/diagram-viewer");
		// ADDED NEW ENTRY
		ignoreList.add("/rest");
	}

	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {
		HttpServletRequest req = (HttpServletRequest) request;
		String path = req.getRequestURI().substring(
				req.getContextPath().length());
		
		int indexSlash = path.indexOf("/", 1);
		String firstPart = null;
		if (indexSlash > 0) {
			firstPart = path.substring(0, indexSlash);
		} else {
			firstPart = path;
		}
		if (ignoreList.contains(firstPart)) {

			chain.doFilter(request, response); // Goes to default servlet.
		} else {
			request.getRequestDispatcher("/ui" + path).forward(request,
					response);
		}
	}

	public void destroy() {
	}

}
