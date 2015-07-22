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

import java.util.List;
import java.util.Map;

import javax.naming.NamingException;
import javax.naming.directory.SearchResult;

import org.activiti.engine.ActivitiException;
import org.activiti.engine.identity.Group;
import org.activiti.engine.identity.Picture;
import org.activiti.engine.identity.User;
import org.activiti.engine.identity.UserQuery;
import org.activiti.engine.impl.Page;
import org.activiti.engine.impl.UserQueryImpl;
import org.activiti.engine.impl.persistence.entity.IdentityInfoEntity;
import org.activiti.engine.impl.persistence.entity.UserEntity;
import org.activiti.engine.impl.persistence.entity.UserIdentityManager;
import org.apache.commons.lang3.builder.ReflectionToStringBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Implementation of the {@link UserIdentityManager} interface specifically for
 * LDAP.
 * 
 * Note that only a few methods are actually implemented, as many of the
 * operations (save, update, etc.) are done on the LDAP system directly.
 * 
 * @author Joram Barrez
 */
public class ExLDAPUserManager extends LDAPUserManager {

	private static Logger logger = LoggerFactory.getLogger(ExLDAPUserManager.class);

	public ExLDAPUserManager(ExLDAPConfigurator ldapConfigurator) {
		super(ldapConfigurator);
	}

	@Override
	public void setUserPicture(String userId, Picture picture) {
		 throw new ActivitiException("LDAP user manager doesn't support user pictures");
	}

	@Override
	public Picture getUserPicture(String userId) {
		UserEntity user = findUserById(userId);
		return user.getPicture();
	}

	@Override
	public UserEntity findUserById(String userId) {
		logger.info("Calling : findUserById with " + ReflectionToStringBuilder.toString(userId));
		return super.findUserById(userId);
	}

	@Override
	public List<User> findUserByQueryCriteria(UserQueryImpl query, Page page) {
		logger.info("Calling : findUserByQueryCriteria with " + ReflectionToStringBuilder.toString(query));
		
		if(query.getId()==null && query.getFullNameLike()==null) {
			query.userFullNameLike("*");
		}		
		return super.findUserByQueryCriteria(query, page);
	}

	@Override
	protected void mapSearchResultToUser(SearchResult result, UserEntity user) throws NamingException {
		logger.info("Calling : mapSearchResultToUser with " + ReflectionToStringBuilder.toString(result));
		super.mapSearchResultToUser(result, user);
		
		if (ldapConfigurator.getUserFirstNameAttribute() != null) {
			try{
				byte[] picBytes = (byte[])result.getAttributes().get(((ExLDAPConfigurator)ldapConfigurator).getUserPictureAttribute()).get();
				if(picBytes!=null)
					user.setPicture(new Picture(picBytes, "application/jpeg"));
	    	}catch(NullPointerException e){
//	    		user.setPicture(null);
	    	}
	    }
	}

	@Override
	public long findUserCountByQueryCriteria(UserQueryImpl query) {
		return super.findUserCountByQueryCriteria(query);
	}

	@Override
	public List<Group> findGroupsByUser(String userId) {
		logger.info("Calling : findGroupsByUser with " + userId);
		return super.findGroupsByUser(userId);
	}

	@Override
	public UserQuery createNewUserQuery() {
		return super.createNewUserQuery();
	}

	@Override
	public IdentityInfoEntity findUserInfoByUserIdAndKey(String userId,String key) {
		logger.info("Calling : findUserInfoByUserIdAndKey with " + userId + " and " + key);
		return super.findUserInfoByUserIdAndKey(userId, key);
	}

	@Override
	public List<String> findUserInfoKeysByUserIdAndType(String userId,String type) {
		logger.info("Calling : findUserInfoKeysByUserIdAndType with " + userId + " and " + type);
		return super.findUserInfoKeysByUserIdAndType(userId, type);
	}

	@Override
	public List<User> findPotentialStarterUsers(String proceDefId) {
		logger.info("Calling : findPotentialStarterUsers with " + proceDefId);
		return super.findPotentialStarterUsers(proceDefId);
	}

	@Override
	public List<User> findUsersByNativeQuery(Map<String, Object> parameterMap,int firstResult, int maxResults) {
		logger.info("Calling : findUsersByNativeQuery with " + parameterMap);
		return super.findUsersByNativeQuery(parameterMap, firstResult, maxResults);
	}

	@Override
	public long findUserCountByNativeQuery(Map<String, Object> parameterMap) {
		logger.info("Calling : findUserCountByNativeQuery with " + parameterMap);
		return super.findUserCountByNativeQuery(parameterMap);
	}	
}
