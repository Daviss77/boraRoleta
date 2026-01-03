    package br.edu.senac.boraroleta.security;

    import br.edu.senac.boraroleta.model.Usuario;
    import br.edu.senac.boraroleta.repository.UsuarioRepository;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.security.core.userdetails.User;
    import org.springframework.security.core.userdetails.UserDetailsService;
    import org.springframework.security.core.userdetails.UserDetails;
    import org.springframework.security.core.userdetails.UsernameNotFoundException;
    import org.springframework.security.crypto.password.PasswordEncoder;
    import org.springframework.stereotype.Service;

    @Service
    public class CustomUserDetailsService implements UserDetailsService {

        @Autowired
        private UsuarioRepository usuarioRepository;

        @Autowired
        private PasswordEncoder passwordEncoder;

        @Override
        public UserDetails loadUserByUsername(String email)
                throws UsernameNotFoundException {

            //ADMIN
            if (email.equals("admin@boraroleta.com")) {
                return User.builder()
                        .username("admin@boraroleta.com")
                        .password("$2a$10$XHtYB2idK1IGnpeAkVCS4.WFm7GrvUyltGw46PVba0R687ZJT1btG") // HASH FIXO
                        .roles("ADMIN")
                        .build();
            }
            //User
            Usuario usuario = usuarioRepository.findByEmail(email)
                    .orElseThrow(() ->
                            new UsernameNotFoundException("Usuário não encontrado"));
            return User.builder()
                    .username(usuario.getEmail())
                    .password(usuario.getSenha())
                    .roles("USER")
                    .build();

        }
    }
