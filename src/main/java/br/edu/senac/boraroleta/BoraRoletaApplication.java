package br.edu.senac.boraroleta;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Classe principal da aplicação BoraRoleta.
 * <p>
 * BoraRoleta é uma plataforma web que permite aos usuários descobrir
 * estabelecimentos noturnos (adegas, bares, pagodes, eventos) próximos
 * à sua localização utilizando a Google Maps API.
 * </p>
 * <p>
 * A aplicação é construída com Spring Boot e segue uma arquitetura em camadas
 * com controllers, services, repositories e models bem definidos.
 * </p>
 *
 * @author Grupo 47 - SENAC
 * @version 1.0
 * @since 2025
 */
@SpringBootApplication
public class BoraRoletaApplication {

	/**
	 * Método principal que inicializa a aplicação Spring Boot.
	 *
	 * @param args argumentos de linha de comando (não utilizados)
	 */
	public static void main(String[] args) {
		SpringApplication.run(BoraRoletaApplication.class, args);
	}

}
