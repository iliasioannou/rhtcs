package org.activiti.ldap;

import java.text.MessageFormat;

import javax.naming.NamingEnumeration;
import javax.naming.NamingException;
import javax.naming.directory.InitialDirContext;
import javax.naming.directory.SearchResult;
import javax.naming.ldap.Rdn;

import org.activiti.engine.ActivitiIllegalArgumentException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ExLDAPQueryBuilder extends LDAPQueryBuilder {

	protected static final Logger LOGGER = LoggerFactory.getLogger(ExLDAPQueryBuilder.class);

	@Override
	public String buildQueryByFullNameLike(LDAPConfigurator ldapConfigurator, String searchText) {
		LOGGER.info("Calling buildQueryByFullNameLike with " + searchText);
		String text = searchText.replace("%", "*");
		try {
			return super.buildQueryByFullNameLike(ldapConfigurator, text);
		} catch (ActivitiIllegalArgumentException aiex) {
			return super.buildQueryByFullNameLike(ldapConfigurator, "*");
		}
	}

	public String buildQueryGroupByGroupId(final ExLDAPConfigurator ldapConfigurator,final String groupId) {
		LOGGER.info("Calling buildQueryGroupForGroupId with " + groupId);
		String searchExpression = null;
		if (ldapConfigurator.getQueryGroupByGroupId() != null) {

			// Fetch the dn of the user
			LDAPTemplate ldapTemplate = new LDAPTemplate(ldapConfigurator);
			String groupDn = ldapTemplate.execute(new LDAPCallBack<String>() {

				public String executeInContext(InitialDirContext initialDirContext) {

					String groupDnSearch = buildQueryByGroupId(ldapConfigurator, groupId);
					try {
						String baseDn = ldapConfigurator.getGroupBaseDn() != null ? ldapConfigurator.getGroupBaseDn() : ldapConfigurator.getBaseDn();
						NamingEnumeration<?> namingEnum = initialDirContext.search(baseDn, groupDnSearch, createSearchControls(ldapConfigurator));
						while (namingEnum.hasMore()) { // Should be only one
							SearchResult result = (SearchResult) namingEnum.next();
							return result.getNameInNamespace();
						}
						namingEnum.close();
					} catch (NamingException e) {
						LOGGER.debug("Could not find group dn : " + e.getMessage(), e);
					}
					return null;
				}

			});

			searchExpression = MessageFormat.format(ldapConfigurator.getQueryGroupByGroupId(), Rdn.escapeValue(groupDn));			
		} else {
			searchExpression = groupId;
		}
		LOGGER.info("Query is \"" + searchExpression + "\"");
		return searchExpression;
	}

	public String buildQueryByGroupId(ExLDAPConfigurator ldapConfigurator, String groupId) {
		String searchExpression = null;
		if (ldapConfigurator.getQueryGroupByGroupId() != null) {
			searchExpression = MessageFormat.format(ldapConfigurator.getQueryGroupByGroupId(), groupId);
		} else {
			searchExpression = groupId;
		}
		return searchExpression;
	}
}
