/* Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.activiti.ldap;

import java.util.ArrayList;
import java.util.List;

import javax.naming.NamingEnumeration;
import javax.naming.NamingException;
import javax.naming.directory.Attribute;
import javax.naming.directory.InitialDirContext;
import javax.naming.directory.SearchResult;

import org.activiti.engine.ActivitiException;
import org.activiti.engine.identity.Group;
import org.activiti.engine.impl.GroupQueryImpl;
import org.activiti.engine.impl.Page;
import org.activiti.engine.impl.persistence.entity.GroupEntity;
import org.apache.commons.lang3.builder.ReflectionToStringBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ExLDAPGroupManager extends LDAPGroupManager {

	private static Logger logger = LoggerFactory.getLogger(ExLDAPGroupManager.class);

	public ExLDAPGroupManager(ExLDAPConfigurator ldapConfigurator, LDAPGroupCache ldapGroupCache) {
		super(ldapConfigurator, ldapGroupCache);
	}

	public ExLDAPGroupManager(ExLDAPConfigurator ldapConfigurator) {
		super(ldapConfigurator);
	}

	@Override
	public List<Group> findGroupByQueryCriteria(GroupQueryImpl query, Page page) {
		logger.info("Calling : findGroupByQueryCriteria with " + ReflectionToStringBuilder.toString(query));
		if (query.getId() != null) {
			return findGroupByGroupId(query.getId());
		} else if (query.getUserId() == null) {
			query.groupMember("*");
		}
		return super.findGroupByQueryCriteria(query, page);
	}

	public List<Group> findGroupByGroupId(final String groupId) {
		logger.info("Calling : findGroupByQueryCriteria with " + groupId);
		LDAPTemplate ldapTemplate = new LDAPTemplate(ldapConfigurator);
		return ldapTemplate.execute(new LDAPCallBack<List<Group>>() {

			public List<Group> executeInContext(InitialDirContext initialDirContext) {
				try {

					String searchExpression = ((ExLDAPQueryBuilder) ldapConfigurator.getLdapQueryBuilder()).buildQueryByGroupId(
							(ExLDAPConfigurator) ldapConfigurator, groupId);

					String baseDn = ldapConfigurator.getGroupBaseDn() != null ? ldapConfigurator.getGroupBaseDn() : ldapConfigurator.getBaseDn();
					NamingEnumeration<?> namingEnum = initialDirContext.search(baseDn, searchExpression, createSearchControls());
					List<Group> groups = new ArrayList<Group>();
					while (namingEnum.hasMore()) { // Should be only one
						SearchResult result = (SearchResult) namingEnum.next();

						GroupEntity group = new GroupEntity();
						if (ldapConfigurator.getGroupIdAttribute() != null) {
							Attribute attribute = result.getAttributes().get(ldapConfigurator.getGroupIdAttribute());
							group.setId(attribute.get().toString());
						}
						if (ldapConfigurator.getGroupNameAttribute() != null) {
							Attribute attribute = result.getAttributes().get(ldapConfigurator.getGroupNameAttribute());
							group.setName(attribute.get().toString());
						}
						if (ldapConfigurator.getGroupTypeAttribute() != null) {
							Attribute attribute = result.getAttributes().get(ldapConfigurator.getGroupTypeAttribute());
							group.setType(attribute != null ? attribute.get().toString() : null);
						}
						groups.add(group);
					}
					namingEnum.close();
					logger.info("Results : " + ReflectionToStringBuilder.toString(groups));
					return groups;

				} catch (NamingException ne) {
					logger.debug("Could not find group " + groupId + " : " + ne.getMessage(), ne);
					return null;
				}
			}

		});
	}

	public List<Group> findGroupsByUser(final String userId) {

		// First try the cache (if one is defined)
		if (ldapGroupCache != null) {
			List<Group> groups = ldapGroupCache.get(userId);
			if (groups != null) {
				return groups;
			}
		}

		// Do the search against Ldap
		LDAPTemplate ldapTemplate = new LDAPTemplate(ldapConfigurator);
		return ldapTemplate.execute(new LDAPCallBack<List<Group>>() {

			public List<Group> executeInContext(InitialDirContext initialDirContext) {

				String searchExpression = ldapConfigurator.getLdapQueryBuilder().buildQueryGroupsForUser(ldapConfigurator, userId);

				List<Group> groups = new ArrayList<Group>();
				try {
					String baseDn = ldapConfigurator.getGroupBaseDn() != null ? ldapConfigurator.getGroupBaseDn() : ldapConfigurator.getBaseDn();
					NamingEnumeration<?> namingEnum = initialDirContext.search(baseDn, searchExpression, createSearchControls());
					while (namingEnum.hasMore()) { // Should be only one
						SearchResult result = (SearchResult) namingEnum.next();

						GroupEntity group = new GroupEntity();
						if (ldapConfigurator.getGroupIdAttribute() != null) {
							Attribute attribute = result.getAttributes().get(ldapConfigurator.getGroupIdAttribute());
							group.setId(attribute.get().toString());
						}
						if (ldapConfigurator.getGroupNameAttribute() != null) {
							Attribute attribute = result.getAttributes().get(ldapConfigurator.getGroupNameAttribute());
							group.setName(attribute.get().toString());
						}
						if (ldapConfigurator.getGroupTypeAttribute() != null) {
							Attribute attribute = result.getAttributes().get(ldapConfigurator.getGroupTypeAttribute());
							group.setType(attribute != null ? attribute.get().toString() : null);
						}
						groups.add(group);
					}

					namingEnum.close();

					// Cache results for later
					if (ldapGroupCache != null) {
						ldapGroupCache.add(userId, groups);
					}

					return groups;

				} catch (NamingException e) {
					throw new ActivitiException("Could not find groups for user " + userId, e);
				}
			}

		});
	}
}
