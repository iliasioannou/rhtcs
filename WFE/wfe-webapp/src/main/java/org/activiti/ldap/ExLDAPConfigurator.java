package org.activiti.ldap;

import org.activiti.engine.runtime.ClockReader;


public class ExLDAPConfigurator extends LDAPConfigurator {
	
	protected String userPictureAttribute;
	protected String queryGroupByGroupId;
	 
	public String getUserPictureAttribute() {
		return userPictureAttribute;
	}

	public void setUserPictureAttribute(String userPictureAttribute) {
		this.userPictureAttribute = userPictureAttribute;
	}

	public String getQueryGroupByGroupId() {
		return queryGroupByGroupId;
	}

	public void setQueryGroupByGroupId(String queryGroupByGroupId) {
		this.queryGroupByGroupId = queryGroupByGroupId;
	}

	@Override
	protected LDAPUserManagerFactory getLdapUserManagerFactory() {
		if (this.ldapUserManagerFactory != null) {
			this.ldapUserManagerFactory.setLdapConfigurator(this);
			return this.ldapUserManagerFactory;
		}
		return new ExLDAPUserManagerFactory(this);
	}
	
	@Override
	protected LDAPGroupManagerFactory getLdapGroupManagerFactory(ClockReader clockReader) {
		if (this.ldapGroupManagerFactory != null) {
			this.ldapGroupManagerFactory.setLdapConfigurator(this);
			return this.ldapGroupManagerFactory;
		}
		return new ExLDAPGroupManagerFactory(this, clockReader);
	}
}
