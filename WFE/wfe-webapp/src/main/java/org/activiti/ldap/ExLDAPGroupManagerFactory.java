package org.activiti.ldap;

import org.activiti.engine.impl.interceptor.Session;
import org.activiti.engine.runtime.ClockReader;

public class ExLDAPGroupManagerFactory extends LDAPGroupManagerFactory {

	public ExLDAPGroupManagerFactory(ExLDAPConfigurator ldapConfigurator, ClockReader clockReader) {
		super(ldapConfigurator, clockReader);
	}

	public Session openSession() {
		if (ldapGroupCache == null) {
			return new ExLDAPGroupManager((ExLDAPConfigurator)ldapConfigurator);
		} else {
			return new ExLDAPGroupManager((ExLDAPConfigurator)ldapConfigurator, ldapGroupCache);
		}
	}
}
